import math

# weight of a node (higher is better)
#
# - let diff = dist(start, dest) - dist(start, src)
# - multiply by log(diff) + 1 if diff > 0
# - multiply by 1/(min(log(-diff) + 2, 1)) if diff < 0
# - unchanged if diff == 0
#
# highway modifiers:
# - cycleway: x15
# - tertiary(_link): x10
# - residential(_link): x5
# - unclassified: x3
# - living_street/pedestrian: x2
# - secondary(_link): x0.5
# - service/track/bridleway/path: x0.3
# - primary(_link)/busway: x0.1
# - trunk(_link)/motorway(_link): x0
# - other: x0
highway_mod = {
    "cycleway": 15,
    "tertiary": 6,
    "tertiary_link": 6,
    "residential": 4,
    "residential_link": 4,
    "unclassified": 3,
    "living_street": 2,
    "pedestrian": 2,
    "service": 2,
    "footway": 1,
    "path": 1,
    "bridleway": 0.8,
    "track": 0.8,
    "secondary": 0.5,
    "secondary_link": 0.5,
    "primary": 0.1,
    "primary_link": 0.1,
    "busway": 0.1
}

service_mod = {
    "driveway": 0.3,
    "alley": 0.3,
    "emergency_access": 0.3,
    "parking_aisle": 0.5,
    "drive_through": 0.4,
    "slipway": 0.3
}

# maxspeed modifier (only if not a cycleway):
# - <20: x0.5
# - <25: x0.8
# - 25: x1
# - <35: x0.9
# - <40: x0.8
# - 40+: x0.5
def maxspeed_mod(ms):
    try:
        x = int(ms.split(" ")[0])
    except (ValueError, TypeError):
        return 1
    if x < 20:
        return 0.5
    elif x < 25:
        return 0.8
    elif x == 25:
        return 1
    elif x < 35:
        return 0.9
    elif x < 40:
        return 0.8
    elif x >= 40:
        return 0.5

# bicycle modifier:
# - designated: x2
# - yes/use_sidepath/optional_sidepath/permissive/destination: x1
# - dismount: x0.8
# - other: x0.2
bicycle_mod = {
    "designated": 2,
    "dismount": 0.8,
    "no": 0.2
}

# cycleway modifier:
# - track: x3
# - lane/crossing/link/soft_lane: x2
# - share_busway: x1.6
# - shared_lane/shoulder: x1.2
# - separate: x0.5
# - other: x1
cycleway_mod = {
    "track": 3,
    "lane": 2,
    "crossing": 2,
    "link": 2,
    "soft_lane": 2,
    "share_busway": 1.6,
    "shared_lane": 1.2,
    "shoulder": 1.2,
    "separate": 0.5
}

# surface modifier:
# - concrete: x0.9
# - paving_stones/compacted: x0.5
# - fine_gravel/gravel/sett/cobblestone: x0.4
# - unpaved/ground/grass/mud/cinders: x0.3
# - other: x1
surface_mod = {
    "concrete": 0.9,
    "paving_stones": 0.5,
    "compacted": 0.5,
    "fine_gravel": 0.4,
    "gravel": 0.4,
    "sett": 0.4,
    "cobblestone": 0.4,
    "unpaved": 0.3,
    "ground": 0.3,
    "grass": 0.3,
    "mud": 0.3,
    "cinders": 0.3
}

# if there are multiple values for a tag, use the worst
#
# if node appears in so_far: multiplier is 0.5 * log(20000/(critical_dist+100)) clipped to [0.5, 1]
# if self loop: x0
#
# Inputs:
# - g: graph
# - start: (y, x) for starting node
# - src: (y, x) for source node
# - dest: destination node id
# - prev: previous node id
# - so_far: list of nodes already visited
# - critical_dist: min(dist_so_far, abs(total_dist - dist_so_far))
# - data: edge data
def weight(dest, prev, data):
    weight = 1

    highway = listify(data.get("highway", ""))
    weight *= min([highway_mod.get(x, 0) for x in highway])

    if "cycleway" in highway:
        cycleway = listify(data.get("cycleway", ""))
        weight *= min([cycleway_mod.get(x, 1) for x in cycleway])
        bicycle = listify(data.get("bicycle", ""))
        weight *= min([bicycle_mod.get(x, 1) for x in bicycle])
    else:
        maxspeed = listify(data.get("maxspeed", ""))
        weight *= min([maxspeed_mod(x) for x in maxspeed])

    service = listify(data.get("service", ""))
    weight *= min([service_mod.get(x, 1) for x in service])

    surface = listify(data.get("surface", ""))
    weight *= min([surface_mod.get(x, 1) for x in surface])
    return 1/(math.log2(weight + 1.001))

def listify(x):
    if not isinstance(x, list):
        return [x]
    return x
