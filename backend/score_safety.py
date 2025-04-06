import numpy as np
from custom_weights import weight

def score_safety(G, route_nodes):
    """
    segment_data_list: list of dicts, each containing OSM edge 'data' (tags)
    Returns a safety score between 1 and 5
    """
    raw_weights = []

    for u, v in zip(route_nodes[:-1], route_nodes[1:]):
        if G.edges(u, v):
            edge_data = G.get_edge_data(u, v)[0]
            w = weight(dest=None, prev=None, data=edge_data)
            raw_weights.append(w)

    # Normalize weights to [0, 1] risk (higher weight = higher risk)
    max_risk = max(raw_weights) if raw_weights else 1
    risks = [w / max_risk for w in raw_weights]

    # Penalize high-risk segments
    penalized_risks = [(r)**1.5 for r in risks]
    avg_penalized_risk = np.mean(penalized_risks)

    # Invert and scale to 1–5 safety score
    normalized_safety = 1.0 - np.sqrt(avg_penalized_risk)
    safety_score = round(1 + normalized_safety * 4, 2).tolist()  # scale to [1, 5]
    return safety_score