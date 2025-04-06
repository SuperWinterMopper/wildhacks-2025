import osmnx as ox
import geopandas as gpd
from shapely.geometry import Point, LineString
from collections import Counter
from geopy.geocoders import Nominatim
import time

# Input: your route as a list of (lat, lon) tuples
route = [1929404001, 251846299, 251846303, 2241471944, 252162806, 2240260233, 252162818, 1767033423, 10775089466, 1258392376, 10775089470, 252162817, 497375717, 672865189, 287472219, 1703679322, 4838831962, 261134731, 252162850, 2241503404, 4838831971, 252162794, 249749850, 4598556861, 9341288642, 9341288636, 252162865, 1936662524, 1934360057, 8797724161, 9886956236, 1262422659, 252162871, 1842860658, 252162793, 1790664820, 1790664817, 1790686398, 1790664794, 1790686397, 1790686439, 1790686431, 252162848, 1930260443, 261145427, 1930264980, 5470278017, 1930260453, 249749855, 2782565532, 1743575724, 1743575458, 1743575724, 2782565532, 249749855, 252162843, 252162814, 252162820, 252162801, 251846306, 251846304, 4103074143, 1930281155, 252162787, 1929403996, 1929404001]  # must be a loop

# Create geometry
route_line = LineString(route)

# Load OSM network around route
G = ox.load_graphml("sarge7.5km.graphml")

# Snap points to graph
nodes = ox.distance.nearest_nodes(G, [pt[1] for pt in route], [pt[0] for pt in route])

# Extract edge data
edges = []
for i in range(len(nodes)-1):
    edge_data = G.get_edge_data(nodes[i], nodes[i+1])
    if edge_data:
        edges.append(edge_data[0])  # take first variation

# Count road names by distance
name_counter = Counter()
for edge in edges:
    name = edge.get('name')
    if name:
        name_counter[name] += edge.get('length', 0)

# Determine dominant road name
dominant_road = name_counter.most_common(1)[0][0] if name_counter else None

# Get route centroid
centroid = route_line.centroid
centroid_latlon = (centroid.y, centroid.x)

# Reverse geocode using geopy
geolocator = Nominatim(user_agent="route_namer")
location = None
attempts = 0
while not location and attempts < 3:
    try:
        location = geolocator.reverse(centroid_latlon, language='en', zoom=16)
    except:
        attempts += 1
        time.sleep(1)

neighborhood = city = None
if location and location.raw.get("address"):
    address = location.raw["address"]
    neighborhood = address.get("neighbourhood") or address.get("suburb") or address.get("city_district")
    city = address.get("city") or address.get("town") or address.get("village")

# Final heuristic
if dominant_road and neighborhood:
    route_name = f"{dominant_road} Loop - {neighborhood}"
elif dominant_road and city:
    route_name = f"{dominant_road} Loop - {city}"
elif neighborhood:
    route_name = f"{neighborhood} Loop"
elif city:
    route_name = f"{city} Loop"
else:
    route_name = "Unnamed Loop"

print("🏷️ Route Name:", route_name)