import React from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  GeoJSON,
} from "react-leaflet";
import { derlaData } from "../../../../../data/derla";
import CustomGeoJson from "./CustomGeoJson";
import CustomMarker from "./CustomMarker";

interface Props {
  currentStepIndex: number;
}

const TheMap: React.FC<Props> = (props) => {
  React.useEffect(() => {
    if (!props.currentStepIndex) return;

    if (props.currentStepIndex === 2) {
      // popupRef.current.openOn(map);
    }
  }, [props.currentStepIndex]);


  const style = (feature) => {
    switch (feature.properties.title) {
      case "Reich":
        return {
          // fillColor: "black",
          weight: 6,
          // opacity: 1,
          color: 'black',
          // dashArray: '3',
          fillOpacity: 0,
        };
      default:
        return {
          fillColor: "red",
          weight: 4,
          opacity: 1,
          color: 'red',
          dashArray: '3',
          fillOpacity: 0,
        };
    }
  };

  return (
    <MapContainer
      center={[47.449358, 15.297192]}
      zoom={5}
      style={{
        height: "100vh",
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
        isActive={props.currentStepIndex === 1}
        data={{
          position: [47.449358, 15.297192],
        }}
      >
        <div style={{ filter: "grayscale(1)" }}>
          <p>... like this one</p>
          <a
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty12/methods/sdef:TEI/get?locale=de"
            target="_blank"
          >
            <p className="h5">Platz benannt nach Maximilian Haitzmann</p>
            <img
              src="https://gams.uni-graz.at/archive/objects/o:derla.sty12/datastreams/IMAGE.2/content"
              width={100}
              height={100}
              loading="lazy"
            ></img>
          </a>
        </div>
      </CustomMarker>
      <CustomMarker
        isActive={props.currentStepIndex === 2}
        data={{
          position: [46.681457, 15.074161],
        }}
      >
        <div style={{ filter: "grayscale(1)" }}>
          <p>... or this one</p>
          <a
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty20/methods/sdef:TEI/get?locale=de"
            target="_blank"
          >
            <p className="h5">
              Grave site for partisans killed in action against German units
            </p>
            <img
              src="https://gams.uni-graz.at/archive/objects/o:derla.sty20/datastreams/IMAGE.1/content"
              width={100}
              height={100}
              loading="lazy"
            ></img>
          </a>
        </div>
      </CustomMarker>
      <CustomMarker
        isActive={props.currentStepIndex === 3}
        data={{
          position: [46.823364, 15.059047],
        }}
      >
        <div style={{ filter: "grayscale(1)" }}>
          <p>... or this one</p>
          <a
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty21/methods/sdef:TEI/get?locale=de"
            target="_blank"
          >
            <p className="h5">Tomb in memory of Karl Spindler</p>
            <img
              src="https://gams.uni-graz.at/archive/objects/o:derla.sty21/datastreams/IMAGE.1/content"
              width={100}
              height={100}
              loading="lazy"
            ></img>
          </a>
        </div>
      </CustomMarker>

      {/* <GeoJSON
      data={derlaData.overviewGEOJSON as any} onEachFeature={onEachCountry} attribution="nice" key="1" style={style}></GeoJSON> */}

      {/* <GeoJSON data={geojsonFeatureComplex as any} style={style}></GeoJSON> */}

      <GeoJSON data={derlaData.overviewGEOJSON as any} style={style}>
        <Popup>German Reich in 1941</Popup>
      </GeoJSON>
      {/* <CustomGeoJson data={geojsonFeatureComplex}></CustomGeoJson> */}
    </MapContainer>
  );
};

export default TheMap;
