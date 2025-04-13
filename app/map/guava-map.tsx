import SimpleMap from "@/app/map/simple-map";
import { Polyline } from "@/app/map/polyline";

export default function GuavaMaps({ route, color, id, onClick }: {
    route: any[],
    color: string, 
    id: number,
    onClick: (id: number) => void
  }) {  
    const positions = route.map(coord => [coord[0], coord[1]]);
    console.log("this is GuavaMaps, route", positions)
  
    return (
      <div 
        className="w-[400px] h-[300px]"
        onClick={() => onClick(id)}
      >
        <SimpleMap>
          <Polyline
            positions={positions}
            color={color}
            weight={5}
            opacity={0.7}
          />
        </SimpleMap>
      </div>
    );
  }