import json
from generate_routes import generate_routes
import osmnx as ox
import functions_framework
import pandas as pd

# Opens graphml
G = ox.load_graphml("sarge7.5km.graphml")

# Opens scenery
S = pd.read_csv('scenic_points.csv', header=None, names=["lat", "lon", "tag"])

@functions_framework.http
def process(request):

    # Handle CORS preflight
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    try:
        data = request.get_json(silent=True) or {}

        start_lat = float(data["start_lat"])
        start_lon = float(data["start_lon"])
        distance = float(data["distance"])

        routes = generate_routes(G, S, start_lat, start_lon, distance, 8)

        return (json.dumps(routes), 200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": '*'
        })
    
    except (TypeError, ValueError) as e:
        # If any of the floats fail or args are missing
        error_message = {"error": f"Invalid input: {str(e)}"}
        return (json.dumps(error_message), 400, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": '*'
        })