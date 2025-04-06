from math import radians, sin, cos, atan2, sqrt, degrees


def haversine_distance(node1, node2, G):
    # Extract latitude and longitude from the nodes
    lat1, lon1 = G.nodes[node1]['y'], G.nodes[node1]['x']
    lat2, lon2 = G.nodes[node2]['y'], G.nodes[node2]['x']
    
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    r = 6371  # Radius of Earth in kilometers
    return r * c

def calculate_midpoint(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    lat1 = radians(lat1)
    lon1 = (lon1)
    lat2 = (lat2)
    lon2 = (lon2)

    # Compute differences
    d_lon = lon2 - lon1

    # Compute Cartesian coordinates
    bx = cos(lat2) * cos(d_lon)
    by = cos(lat2) * sin(d_lon)
    lat3 = atan2(sin(lat1) + sin(lat2),
                      sqrt((cos(lat1) + bx) * (cos(lat1) + bx) + by * by))
    lon3 = lon1 + atan2(by, cos(lat1) + bx)

    # Convert back to degrees
    lat3 = degrees(lat3)
    lon3 = degrees(lon3)

    return lat3, lon3


def calculate_bearing(lat1, lon1, lat2, lon2):
    """
    Calculate bearing between two points.
    Result is in degrees from North (0° = North, 90° = East, etc.)
    """
    lat1 = radians(lat1)
    lat2 = radians(lat2)
    diff_long = radians(lon2 - lon1)

    x = sin(diff_long) * cos(lat2)
    y = cos(lat1) * sin(lat2) - \
        sin(lat1) * cos(lat2) * cos(diff_long)

    initial_bearing = atan2(x, y)
    bearing = (degrees(initial_bearing) + 360) % 360
    return bearing