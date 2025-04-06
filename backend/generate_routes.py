import osmnx as ox
import networkx as nx
import math
from custom_weights import weight
from latlonutil import haversine_distance, calculate_bearing

# --- CONFIGURATION ---
THRESH = 6.5 # percent
R = 6371.0 * 1000  # Earth's radius in meters
MIN_DIST_SCALAR = 0.25
MAX_DIST_SCALAR = 0.3

def haversine_with_graph(G):
    return lambda u, v: haversine_distance(u, v, G)

def linspace(start, stop, num):
    if num == 1:
        return [start]
    step = (stop - start) / (num - 1)
    return [start + i * step for i in range(num)]

def destination_point(G, lat1, lon1, d, theta):

    # Convert latitude, longitude, and bearing to radians
    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    theta = math.radians(theta)

    # Angular distance
    delta = d / R

    # Compute new latitude
    lat2 = math.asin(math.sin(lat1) * math.cos(delta) +
                     math.cos(lat1) * math.sin(delta) * math.cos(theta))
    # Compute new longitude
    lon2 = lon1 + math.atan2(math.sin(theta) * math.sin(delta) * math.cos(lat1),
                             math.cos(delta) - math.sin(lat1) * math.sin(lat2))
    # Convert back to degrees
    lat2 = math.degrees(lat2)
    lon2 = math.degrees(lon2)

    return ox.distance.nearest_nodes(G, float(lon2), float(lat2))


def nodes_in_slice(G, start_node, angle_min, angle_max, distance_min, distance_max):
    """
    Fast version using projected coordinates and vectorized math.
    Returns a list of node IDs within a specified wedge.
    """

    start_node = G.nodes[start_node]
    filtered = [nodeid for nodeid, data in G.nodes(data=True) if 
                distance_min <= ox.distance.great_circle(data["y"], data["x"], start_node["y"], start_node["x"]) <= distance_max and
                angle_min <= calculate_bearing(start_node["y"], start_node["x"], data["y"], data["x"]) <= angle_max]

    lowest_node = None
    lowest_weight = math.inf
    
    for node in filtered:
        weights = [weight(None, None, d) for u, v, d in G.edges(node, data=True)]
        average_weight = sum(weights)/len(weights)
        if average_weight < lowest_weight:
            lowest_weight = average_weight
            lowest_node = node

    return lowest_node


def perpendicular_point(G, lat1, lon1, lat2, lon2, distance_km):

    # Convert degrees to radians
    lat1, lon1 = math.radians(lat1), math.radians(lon1)
    lat2, lon2 = math.radians(lat2), math.radians(lon2)

    # Midpoint calculations
    lat_m = (lat1 + lat2) / 2
    lon_m = (lon1 + lon2) / 2

    # Differences
    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1

    # Perpendicular vector (swap and negate)
    delta_lat_perp = -delta_lon
    delta_lon_perp = delta_lat

    # Normalize perpendicular vector
    length = math.sqrt(delta_lat_perp**2 + delta_lon_perp**2)
    delta_lat_perp /= length
    delta_lon_perp /= length

    # Distance in radians
    delta_sigma = distance_km / R

    # Destination point calculations
    lat_d = lat_m + delta_sigma * delta_lat_perp
    lon_d = lon_m + (delta_sigma * delta_lon_perp) / math.cos(lat_m)

    # Convert radians back to degrees
    lat_d, lon_d = math.degrees(lat_d), math.degrees(lon_d)

    return ox.distance.nearest_nodes(G, float(lon_d), float(lat_d))


def get_path_distance(G, path):
    distance = 0
    for u, v in zip(path[:-1], path[1:]):
        data = min(G.get_edge_data(u, v).values(), key=lambda x: x.get("length", 0))
        distance += data.get("length", 0)
    return distance


def generate_routes(G, source_lat, source_lon, loop_distance, num_slices=8, thresh=THRESH):
    point_1 = ox.distance.nearest_nodes(G, float(source_lon), float(source_lat))

    min_dist = MIN_DIST_SCALAR * loop_distance
    max_dist = MAX_DIST_SCALAR * loop_distance

    lon1 = G.nodes[point_1]['x']
    lat1 = G.nodes[point_1]['y']
    
    paths = []
    for bearing in linspace(0, 360, num_slices):

        point_2 = nodes_in_slice(G, point_1, bearing, bearing + 360/num_slices, min_dist, max_dist)
        if point_2 == None:
            continue

        lon2 = G.nodes[point_2]['x']
        lat2 = G.nodes[point_2]['y']

        path_1_to_2 = nx.astar_path(G, point_1, point_2, heuristic=haversine_with_graph(G), weight='length')

        last_points = [-1, -1, -1, -1, -2]
        for km in linspace(0, loop_distance/2, 15):
            point_3 = perpendicular_point(G, lat1, lon1, lat2, lon2, km)
            if len(set(last_points)) <= 1:
                break
            
            last_points = [point_3] + last_points[:-1]

            try:
                subset = set(G.nodes) - (set(path_1_to_2[1:-1]) - {point_3} - {point_2})
                path_2_to_3 = nx.astar_path(G.subgraph(subset), point_2, point_3, heuristic=haversine_with_graph(G), weight=weight)
            except nx.NetworkXNoPath:
                path_2_to_3 = nx.astar_path(G, point_2, point_3, heuristic=haversine_with_graph(G), weight=weight)

            try:
                subset = set(G.nodes) - (set(path_1_to_2[1:] + path_2_to_3[:-1]) - {point_3} - {point_1})
                path_3_to_1 = nx.astar_path(G.subgraph(subset), point_3, point_1, heuristic=haversine_with_graph(G), weight=weight)
            except nx.NetworkXNoPath:
                path_3_to_1 = nx.astar_path(G, point_3, point_1, heuristic=haversine_with_graph(G), weight=weight)

            total_path = path_1_to_2 + path_2_to_3[1:] + path_3_to_1[1:]
            total_distance = get_path_distance(G, total_path)

            if abs(loop_distance - total_distance) < thresh*0.01*loop_distance or total_distance > loop_distance:
                paths.append({
                    "nodes": path_1_to_2 + path_2_to_3[1:] + path_3_to_1[1:],
                    "distance": total_distance,
                    "name": "filler name",
                })
                break
    
    # Returns paths
    return paths


if __name__ == "__main__":
    SOURCE_LATLON = (42.062365, -87.677904)
    GRAPHML_FILE = "sarge7.5km.graphml"

    G = ox.load_graphml(GRAPHML_FILE)

    routes = generate_routes(G, 42.062365, -87.677904, loop_distance=16000, num_slices=10)

    # Plot graph with route
    for path in routes:
        ox.plot_graph_route(G, path["nodes"], route_linewidth=2, node_size=0)
    
    #print(paths)