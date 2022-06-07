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

  /**
   * Provides content to the legendbox according to given stepcount
   * @returns 
   */
  const switchLegendContent = (step: number) => {

    if(step < 1){
      return {
        heading: "DERLA's area of research",
        text: <p className="text-dark">The <b className="text-danger">red areas</b> mark the project's geographical focus. (Styria and Vorarlberg in today's Austria) Additionally this map shows the borders of the German Reich in 1941 and a small section of the documented places.</p>,
      }
    } else if((step >= 1) && (step < 3)){
      return {
        heading: "Example places of remembrance",
        text: <p className="text-dark">DERLA documents around <b className="text-dark">600 places in Austria</b> via providing geographical information, photos and biographical backgrounds. A <b className="text-dark">click on a place</b> heading will lead you to the detailed description on the DERLA platform.</p>,
      }
    } else if(step < 5) {

      return {
        heading: "Material and background",
        text:<><p className="text-dark">Each digital place mark lists victims and dedicated URIs to a centralized register on DERLA. ("The Archive of Names") </p>
          <ul>
            <li><a className="text-dark" target="_blank" href="https://gams.uni-graz.at/archive/objects/context:derlapers/methods/sdef:Context/get?locale=de">Archive of Names</a></li>
            <li><a className="text-dark" target="_blank" href="https://gams.uni-graz.at/archive/objects/o:derla.persvor/methods/sdef:TEI/get?locale=de">Overview of victims of the state Vorarlberg</a></li>
          </ul>
        </>
      }

    } else if (step <= 5){
      return {
        heading: "Documentation and education",
        text: (
          <>
            <p className="text-dark">... DERLA also provides various <b className="text-dark">teaching materials</b> like stories or original source-material.</p>
            <ul>
              <li><a className="text-secondary" target="_blank" href="https://gams.uni-graz.at/archive/objects/context:derladidactics/methods/sdef:Context/get?locale=de">Overview of the teaching material on DERLA</a></li>
              <li><a className="text-secondary" target="_blank" href="https://gams.uni-graz.at/o:derla.fixsty5">Singular teaching material for one school lesson</a></li>
            </ul>
          </>
        )
      }
    } else if (step <= 11){
      return {
        heading:"Future progress",
        text:"... in the end DERLA tries to document all places of remembrance in today's Austria."
      }
    }

  }

  return (
    <div
      id="sticky-map-container"
      style={{ top: props.currentStepIndex > 10 ? "-101%" : "" }}
      className="sticky-top"
    >
      <CustomMap
        tileLayerUrl="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
        legendBox={
          props.currentStepIndex <= 11 && <LegendBox
            currentStepIndex={props.currentStepIndex}
            isInitExpanded={true}
            // render content conditionally via switch statement and generate content object
            content={switchLegendContent(props.currentStepIndex)}
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
        <CustomMarker
          isActive={props.currentStepIndex === 4}
          position={[46.969346, 10.061606]}
        >
          <CustomPopup
            href="https://gams.uni-graz.at/archive/objects/o:derla.vor111/methods/sdef:TEI/get?mode=view:object:default&amp;locale=de"
            label="Audiostation Energieraum Illwerke Partenen"
            imgSrc="https://gams.uni-graz.at/archive/objects/o:derla.vor111/datastreams/IMAGE.1/content"
          />
        </CustomMarker>
        <CustomMarker
          isActive={props.currentStepIndex === 5}
          position={[47.346979, 9.672991]}
        >
          <CustomPopup
            href="https://gams.uni-graz.at/archive/objects/o:derla.vor67/methods/sdef:TEI/get?mode=view:object:default&amp;locale=de"
            label="Grabstein für Familie Weil im Jüdischen Friedhof Hohenems"
            imgSrc="https://gams.uni-graz.at/archive/objects/o:derla.vor67/datastreams/IMAGE.1/content"
          />
        </CustomMarker>
        {(props.currentStepIndex >= 6) && (
          <CustomGeoJson
            data={derlaData.researchStateGEOJSON as any}
            style={(feature) => {
              switch(feature.properties.title){
                case "Austria":
                  return {
                    fillColor: "lightgreen",
                    weight: 0,
                    opacity: .1,
                    color: "red",
                    dashArray: "3",
                    fillOpacity: .5,
                  }
                default:
                  return {
                    weight: 2,
                    color:"black",
                    fillOpacity: 0,
                    dashArray: "3"
                  }
              }
            }}
            zoom={6}
          ></CustomGeoJson>
        )}
      </CustomMap>
    </div>
  );
};

export default TheMap;
