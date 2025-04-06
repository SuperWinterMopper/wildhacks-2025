import osmnx as ox
import geopandas as gpd
from shapely.geometry import Point
from pyproj import CRS

# Define relevant scenic tags
SCENIC_TAGS = {
    'natural': ['tree', 'wood', 'forest', 'water', 'beach', 'cliff', 
                'valley', 'peak', 'spring', 'geyser', 'cave_entrance'],
    'tourism': ['viewpoint', 'picnic_site', 'attraction', 'artwork'],
    'leisure': ['park', 'garden', 'nature_reserve'],
    'waterway': ['river', 'stream', 'waterfall', 'dam'],
    'historic': ['castle', 'monument', 'ruins'],
    'man_made': ['pier', 'lighthouse', 'tower']
}

def get_utm_crs(lat, lng):
    zone_number = int((lng + 180) / 6) + 1
    is_northern = lat >= 0
    return CRS.from_dict({
        'proj': 'utm',
        'zone': zone_number,
        'south': not is_northern,
        'ellps': 'WGS84',
        'datum': 'WGS84',
        'units': 'm',
        'no_defs': True
    })

def download_clean_scenic_points(lat, lng, radius=7500):
    center_point = Point(lng, lat)
    buffer_deg = radius / 111320  # meters to degrees approx
    bounding_polygon = center_point.buffer(buffer_deg)

    try:
        gdf = ox.features_from_polygon(bounding_polygon, tags=SCENIC_TAGS)
        if gdf.empty:
            print("No features found.")
            return gpd.GeoDataFrame(columns=["lat", "lon", "type"], geometry=[])

        # Identify type tag (first match wins)
        def get_feature_type(row):
            for key, values in SCENIC_TAGS.items():
                if key in row and row[key] in values:
                    return key
            return None

        # Keep only rows that match one of the specified scenic types
        gdf['type'] = gdf.apply(get_feature_type, axis=1)
        gdf = gdf[gdf['type'].notnull()]

        # Extract lat/lon from geometry
        gdf = gdf[gdf.geometry.type == 'Point']  # Keep only point features
        gdf['lat'] = gdf.geometry.y
        gdf['lon'] = gdf.geometry.x

        # Keep only relevant columns
        return gdf[['lat', 'lon', 'type']].reset_index(drop=True)

    except Exception as e:
        print(f"Error: {e}")
        return gpd.GeoDataFrame(columns=["lat", "lon", "type"])

# Example usage
if __name__ == "__main__":
    ox.settings.log_console = True
    ox.settings.timeout = 300
    ox.settings.use_cache = True

    lat, lng = 42.062365, -87.677904  # Chicago

    scenic_points = download_clean_scenic_points(lat, lng, radius=7500)

    if not scenic_points.empty:
        print(scenic_points.head())
        scenic_points.to_csv("scenic_points.csv", index=False)
        print("Saved to scenic_points.csv")
    else:
        print("No scenic points found.")
