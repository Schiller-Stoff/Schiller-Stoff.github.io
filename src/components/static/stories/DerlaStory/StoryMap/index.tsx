import React from "react";
import { derlaData } from "../../../../../data/derla";
import CustomGeoJson from "./CustomGeoJson";
import CustomMap from "./CustomMap";
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
    <div
      id="sticky-map-container"
      style={{ top: props.currentStepIndex > 4 ? "-101%" : "" }}
      className="sticky-top"
    >
      <CustomMap
        tileLayerUrl="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
        legendBox={
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
        }
      >
        {!props.currentStepIndex && (
          <CustomGeoJson
            data={derlaData.overviewGEOJSON as any}
            style={style}
            zoom={5}
          ></CustomGeoJson>
        )}
        <CustomMarker
          isActive={props.currentStepIndex === 1}
          zoom={7}
          position={[47.449358, 15.297192]}
        >
          <CustomPopup
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty12/methods/sdef:TEI/get?locale=de"
            label="Platz benannt nach Maximilian Haitzmann"
            imgSrc="https://gams.uni-graz.at/archive/objects/o:derla.sty12/datastreams/IMAGE.2/content"
          ></CustomPopup>
        </CustomMarker>
        <CustomMarker
          isActive={props.currentStepIndex === 2}
          position={[46.681457, 15.074161]}
        >
          <CustomPopup
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty20/methods/sdef:TEI/get?locale=de"
            label="Grave site for partisans killed in action against German units"
            imgSrc="https://gams.uni-graz.at/archive/objects/o:derla.sty20/datastreams/IMAGE.1/content"
          />
        </CustomMarker>
        <CustomMarker
          isActive={props.currentStepIndex === 3}
          position={[46.823364, 15.059047]}
        >
          <CustomPopup
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty21/methods/sdef:TEI/get?locale=de"
            label="Tomb in memory of Karl Spindler"
            imgSrc="https://gams.uni-graz.at/archive/objects/o:derla.sty21/datastreams/IMAGE.1/content"
          />
        </CustomMarker>
      </CustomMap>
    </div>
  );
};

export default TheMap;
