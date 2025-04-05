import Image from "next/image";
import DistanceSelector from "./initial-selection";
import ButtonPress from "./button-press";
import MapPage from "./map-page";
import SimpleMap from "./simple-map";

export default function Home() {
  return (  
    <div className="flex justify-center my-10">
      <div className="w-5/6 h-screen border-gray-500 border-2">
        <DistanceSelector/>
        <ButtonPress/>
        <SimpleMap/>
      </div>
    </div>
  );
}
