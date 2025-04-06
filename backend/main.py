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

    route_type = "Scenic" if request.scenery > 3 else "Standard"
    safety_level = "High" if request.safety > 3 else "Normal"

    routes = generate_routes(G, 
                             request.start_lat, 
                             request.start_lon,
                             request.distance,)

    return {
        "message": routes
    }