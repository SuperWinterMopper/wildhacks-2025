# TO RUN THIS BACKEND:
# uvicorn main:app --reload --port 8000


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

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

    # temporary code.
    
    # Josh and Mirai, delete this code and add your code.
    # the request has the variables listed in the class RouteRequest listed above
    # access them via `request.travelType``, `request.unit`, etc
    
    # RETURN IN THE FOLLOWING FORMAT:
    # return {
    #    "message": [ [x,y], [x,y], [x,y] ...]
    # }
    
    route_type = "Scenic" if request.scenery > 3 else "Standard"
    safety_level = "High" if request.safety > 3 else "Normal"


    return {
        "message": [route_type, safety_level, request.travelType, request.unit, request.distance, request.start_lat, request.start_lon]
    }