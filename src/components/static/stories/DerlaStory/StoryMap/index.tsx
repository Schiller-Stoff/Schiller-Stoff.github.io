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
      center={[47.449358, 15.297192]}
      zoom={6}
      style={{
        height: "85vh",
        backgroundColor: "whitesmoke",
        marginTop: "80px",
        marginBottom: "90px",
      }}
      touchZoom={false}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
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
      <CustomMarker
        isActive={props.currentStepIndex <= 1}
        data={{
          position: [47.449358, 15.297192],
        }}
      >
        <div style={{filter:"grayscale(1)"}}>
          <p>... like this one</p>
          <a
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty12/methods/sdef:TEI/get?locale=de"
            target="_blank"
          >
            <p className="h5">Platz benannt nach Maximilian Haitzmann</p>
            <img src="https://gams.uni-graz.at/archive/objects/o:derla.sty12/datastreams/IMAGE.2/content" width={100} height={100} loading="lazy"></img>
          </a>
          
        </div>
      </CustomMarker>
      <CustomMarker
        isActive={props.currentStepIndex >= 2}
        data={{
          position: [41.505, -0.09],
        }}
      ></CustomMarker>
    </MapContainer>
  );
};

export default TheMap;
