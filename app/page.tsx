import Image from "next/image";
import DistanceSelector from "./initial-selection";
import ButtonPress from "./button-press";

export default function Home() {
  return (  
    <div className="flex justify-center">
      <div className="w-5/6 h-screen border-gray-500 border-2">
        <DistanceSelector/>
        <ButtonPress/>
      </div>
    </div>
  );
}
