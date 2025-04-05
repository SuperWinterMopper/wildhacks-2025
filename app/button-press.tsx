"use client"
import { Button } from "@/components/ui/button"

function ButtonPress(){
    return(
        <div className="flex justify-center items-center w-full">
            <Button variant="outline" className="!border-2 !border-green-500 font-medium flex justify-center p-4 cursor-pointer w-70 h-15 text-3xl"> 
            Find me routes
            </Button>
        </div>
    );
}

export default ButtonPress