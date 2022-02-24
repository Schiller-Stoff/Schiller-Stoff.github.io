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
import CustomPopup from "./CustomPopup";
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

        <CustomMarker
          isActive={props.currentStepIndex === 1}
          zoom={7}
          data={{
            position: [47.449358, 15.297192],
          }}
        >
          <CustomPopup
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty12/methods/sdef:TEI/get?locale=de"
            label="Platz benannt nach Maximilian Haitzmann"
            imgSrc="https://gams.uni-graz.at/archive/objects/o:derla.sty12/datastreams/IMAGE.2/content"
          ></CustomPopup>
        </CustomMarker>
        <CustomMarker
          isActive={props.currentStepIndex === 2}
          data={{
            position: [46.681457, 15.074161],
          }}
        >
          <CustomPopup
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty20/methods/sdef:TEI/get?locale=de"
            label="Grave site for partisans killed in action against German units"
            imgSrc="https://gams.uni-graz.at/archive/objects/o:derla.sty20/datastreams/IMAGE.1/content"
          />
        </CustomMarker>
        <CustomMarker
          isActive={props.currentStepIndex === 3}
          data={{
            position: [46.823364, 15.059047],
          }}
        >
          <CustomPopup
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty21/methods/sdef:TEI/get?locale=de"
            label="Tomb in memory of Karl Spindler"
            imgSrc="https://gams.uni-graz.at/archive/objects/o:derla.sty21/datastreams/IMAGE.1/content"
          />
        </CustomMarker>
      </MapContainer>
      <LegendBox
        currentStepIndex={props.currentStepIndex}
        // render content conditionally via switch statement and generate content object
        content={{
          heading:
            props.currentStepIndex >= 1
              ? "Example places of remembrance"
              : "DERLA's area of research",
          text: "DERLA documents places of remembrances in the red areas. (Styria and Vorarlberg in today's Austria) Additionally this map shows the borders of the German Reich in 1941",
        }}
      />
    </>
  );
};

export default TheMap;
