import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

interface Props {
  children?: any;
  legendBox?: any;
}

const CustomMap: React.FC<Props> = (props) => {
  return (
    <>
    <MapContainer
      center={[52.449358, 15.297192]}
      zoom={5}
      style={{
        height: "100vh",
        backgroundColor: "whitesmoke",
        //marginTop: "80px",
        //marginBottom: "90px",
      }}
      touchZoom={false}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
      />
      {props.children}
    </MapContainer>
    {props.legendBox}
    </>
  );
};

export default CustomMap;
