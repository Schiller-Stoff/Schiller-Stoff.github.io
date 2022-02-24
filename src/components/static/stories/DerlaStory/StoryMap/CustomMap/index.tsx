import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

interface Props {
  children?: any;
  center?: [number, number];
  legendBox?: any;
  style?: React.CSSProperties;
  tileLayerUrl?: string;
  zoom?: number;
}

const CustomMap: React.FC<Props> = ({ 
  children, 
  center = [52.449358, 15.297192], 
  legendBox, 
  style = {
    height: "100vh",
    backgroundColor: "whitesmoke",
    //marginTop: "80px",
    //marginBottom: "90px",
  },
  tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  zoom = 5
}) => {
  return (
    <>
      <MapContainer
        center={center}
        zoom={zoom}
        style={style}
        touchZoom={false}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={tileLayerUrl}
        />
        {children}
      </MapContainer>
      {legendBox}
    </>
  );
};

export default CustomMap;
