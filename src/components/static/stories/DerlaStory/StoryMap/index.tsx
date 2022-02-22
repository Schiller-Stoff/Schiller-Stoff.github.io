import React from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import CustomMarker from "./CustomMarker";

interface Props {
  currentStepIndex: number;
}

const TheMap: React.FC<Props> = (props) => {

  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!props.currentStepIndex) return;

    if (props.currentStepIndex === 2) {
      // popupRef.current.openOn(map);
    }
  }, [props.currentStepIndex]);

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{
        height: "400px",
        backgroundColor: "red",
        marginTop: "80px",
        marginBottom: "90px",
      }}
      touchZoom={false}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Marker position={[51.205, -0.09]}>
        <Popup ref={popupRef}>
          Another marker. <br /> Easily customizable.
        </Popup>
      </Marker> */}
      <CustomMarker isActive={props.currentStepIndex <= 1} data={{
          position: [51.505, -0.09]
        }}></CustomMarker>
        <CustomMarker isActive={props.currentStepIndex >= 2} data={{
          position: [41.505, -0.09]
        }}></CustomMarker>
    </MapContainer>
  );
};

export default TheMap;
