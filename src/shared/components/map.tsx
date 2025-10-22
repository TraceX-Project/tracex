"use client"

import { MapContainer, TileLayer, Marker, Popup,useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect } from "react";
import { posix } from "path";



const Map = () => {
    const SearchField = () => {
        const provider = new OpenStreetMapProvider();

    // @ts-ignore
    const searchControl = new GeoSearchControl({
        provider: provider,
        style: 'bar',
        showMarker: true,
        showPopup: false,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: true,
        searchLabel: 'Enter address',
        notFoundMessage: 'Sorry, that address could not be found.',
        maxMarkers: 1,
        zoomLevel: 18,
        position: 'topright'
    });

    const map = useMap();
    useEffect(() => {
        map.addControl(searchControl);
        return () => {
            map.removeControl(searchControl);
        };
    }, []);

    return null;
    };
    return (
        <MapContainer
            center={[4.79029, -75.69003]}
            zoom={19}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SearchField />
            <Marker position={[4.79029, -75.69003]} draggable={true}>
                <Popup>Hey ! I study here</Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map
