import osmnx as ox
import geopandas as gpd
from shapely.geometry import LineString
from shapely import Point
import pandas as pd

def score_scenery(S, route_coords):

    # Example: Get a route (this assumes you already have one)
    route = LineString(route_coords)  # Example coords
    route_gdf = gpd.GeoDataFrame(geometry=[route], crs='EPSG:4326')
    route_gdf = route_gdf.to_crs(epsg=3857)
    buffer = route_gdf.buffer(100)  # 100 meter buffer

    # 3. Convert to GeoDataFrame
    gdf_points = gpd.GeoDataFrame(
        S,
        geometry=[Point(float(lon), float(lat)) for lat, lon, tag in zip(S.lat, S.lon, S.tag)],
        crs="EPSG:4326"
    )

    # 4. Reproject to match route CRS (important for spatial ops!)
    gdf_points = gdf_points.to_crs(route_gdf.crs)

    # 5. Spatial filter: only points within the buffer
    points_within = gdf_points[gdf_points.geometry.within(buffer)]
    points_within = len(points_within)

    if points_within >= 15:
        return 5
    elif points_within >= 10:
        return 4
    elif points_within >= 5:
        return 3
    elif points_within >= 2:
        return 2
    else:
        return 1