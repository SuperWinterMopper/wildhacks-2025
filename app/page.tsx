import Image from "next/image";
import DistanceSelector from "./InitialSelection";

export default function Home() {
  return (  
    <div className="flex justify-center">
      <div className="w-5/6 h-screen border-gray-500 border-2">
        <DistanceSelector/>
      </div>
    </div>
  );
}
