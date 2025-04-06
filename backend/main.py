# TO RUN THIS BACKEND:
# uvicorn main:app --reload --port 8000

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import osmnx as ox
from generate_routes import generate_routes

app = FastAPI()

G = ox.load_graphml("sarge7.5km.graphml")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# class for input to guavaFinder()
class RouteRequest(BaseModel):
    distance: float
    unit: str
    travelType: str
    scenery: int 
    safety: int 
    start_lat: float
    start_lon: float

@app.get("/guava")
def guavaFinder_get():
    return {"message": "Testing, response recieved from backend. Guava"}

@app.post("/guava")
def guavaFinder_post(request: RouteRequest): 

    print(f"request.start_lat {request.start_lat}")
    print(f"request.start_lon {request.start_lon}")
    print(f"request.distance {request.distance}")

    # routes = generate_routes(G, 
    #                          request.start_lat, 
    #                          request.start_lon,
    #                          request.distance,
    #                          8)

    routes = generate_routes(G, source_lat=42.062365, source_lon=-87.677904, loop_distance=5, num_slices=8)
    
    print(f"THE RESULTING ROUTES ARE:{routes}")
    return {
        "message": routes
    }