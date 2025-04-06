from collections import defaultdict

def name_route(G, route_nodes, total_distance):

    # Dictionary to accumulate road lengths
    road_lengths = defaultdict(float)

    # Iterate through pairs of consecutive nodes in the route
    for u, v in zip(route_nodes[:-1], route_nodes[1:]):

        if G.has_edge(u, v):

            edge_data = G.get_edge_data(u, v)

            # If the graph is multigraph, edge_data is a dict of keys
            if isinstance(edge_data, dict) and 0 in edge_data:
                edge_data = edge_data[0]  # Pick the first edge if multigraph

            road_name = edge_data.get("name")
            length = edge_data.get("length")  # Adjust key if it's named differently

            if road_name and length:
                if type(road_name) == list:
                    for name in road_name:
                        road_lengths[name] += float(length)
                else:
                    road_lengths[road_name] += float(length)

    # Get top 3 streets by total length
    top_roads = sorted(road_lengths.items(), key=lambda x: x[1], reverse=True)

    # Case 0: Only 1 road
    if len(top_roads) <= 1:
        return top_roads[0][0] + " loop"
    # Case 1: 1 road dominates the rest
    if top_roads[0][1] >= 1.5 * top_roads[1][1]:
        return top_roads[0][0] + " run"
    # Case 2: 2 roads are about the same
    if min(top_roads[0][1], top_roads[1][1]) / max(top_roads[0][1], top_roads[1][1]) >= 0.8:
        return top_roads[0][0] + " & " + top_roads[1][0] + " run"
    # Case 3: Unclear
    else:
        return "fun ahh loop"