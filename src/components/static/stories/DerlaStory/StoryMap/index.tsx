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
import LegendBox from "./LegendBox";

interface Props {
  currentStepIndex: number;
}

const TheMap: React.FC<Props> = (props) => {
  React.useEffect(() => {
    console.log(props.currentStepIndex);
  }, [props.currentStepIndex]);

  const style = (feature) => {
    switch (feature.properties.title) {
      case "Reich":
        return {
          // fillColor: "black",
          weight: 6,
          // opacity: 1,
          color: "black",
          // dashArray: '3',
          fillOpacity: 0,
        };
      default:
        return {
          fillColor: "red",
          weight: 4,
          opacity: 1,
          color: "red",
          dashArray: "3",
          fillOpacity: 0,
        };
    }
  };

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

        {!props.currentStepIndex && (
          <CustomGeoJson
            data={derlaData.overviewGEOJSON as any}
            style={style}
            zoom={5}
          >
            <Popup>German Reich in 1941</Popup>
          </CustomGeoJson>
        )}

        {/* {!props.currentStepIndex && <GeoJSON data={derlaData.overviewGEOJSON as any} style={style}>
          <Popup>German Reich in 1941</Popup>
        </GeoJSON>} */}

        <CustomMarker
          isActive={props.currentStepIndex === 1}
          zoom={7}
          data={{
            position: [47.449358, 15.297192],
          }}
        >
          <div style={{ filter: "grayscale(1)" }}>
            <a
              href="https://gams.uni-graz.at/archive/objects/o:derla.sty12/methods/sdef:TEI/get?locale=de"
              target="_blank"
            >
              <p className="h5">Platz benannt nach Maximilian Haitzmann</p>
              <img
                src="https://gams.uni-graz.at/archive/objects/o:derla.sty12/datastreams/IMAGE.2/content"
                width={200}
                height={200}
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
            <a
              href="https://gams.uni-graz.at/archive/objects/o:derla.sty20/methods/sdef:TEI/get?locale=de"
              target="_blank"
            >
              <p className="h5">
                Grave site for partisans killed in action against German units
              </p>
              <img
                src="https://gams.uni-graz.at/archive/objects/o:derla.sty20/datastreams/IMAGE.1/content"
                width={200}
                height={200}
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
            <a
              href="https://gams.uni-graz.at/archive/objects/o:derla.sty21/methods/sdef:TEI/get?locale=de"
              target="_blank"
            >
              <p className="h5">Tomb in memory of Karl Spindler</p>
              <img
                src="https://gams.uni-graz.at/archive/objects/o:derla.sty21/datastreams/IMAGE.1/content"
                width={200}
                height={200}
                loading="lazy"
              ></img>
            </a>
          </div>
        </CustomMarker>
      </MapContainer>
      <LegendBox currentStepIndex={props.currentStepIndex}></LegendBox>
    </>
  );
};

export default TheMap;
