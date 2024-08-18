import React, { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import "../App.css"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MapContent from "./MapContent";
import { Box } from "@mui/material";


function Map({ heatmap, searchValue }) {

    return (
        <Box mt={2} sx={{ width: "100%", height: { lg: '640px', xs: '200px' }, backgroundColor: 'white' }}>
            <MapContainer key={0} center={[39.0119, -98.9018]} zoom={5} style={{ width: '100%', height: '100%', backgroundColor: '#d5eeef' }}>
                < TileLayer
                    url="https://{s}.tile.openstreetmap.us/{z}/{x}/{y}.png"
                    subdomains={['a', 'b', 'c', 'd']}
                />
                <MapContent heatmap={heatmap} searchValue={searchValue} />
            </MapContainer>
        </Box>
    );
}


export default Map;