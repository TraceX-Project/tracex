"use client"
import dynamic from "next/dynamic";
import { useMemo } from "react";


export function PhysicalMap() {
    const Map = useMemo(
        () => 
            dynamic(() => import('../../shared/components/map'),
            {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }
    ), [])
    return (
        <>
            <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
                <Map />
            </div>
        </>
    )
}