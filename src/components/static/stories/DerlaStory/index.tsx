import React from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
//@ts-ignore
import { Scrollama, Step } from "react-scrollama";
import "leaflet/dist/leaflet.css";
import ContentHeading from "../../../shared/ContentHeading";

/**
 * Repairs the invisible leaflet icons for react-leaflet!
 */
import L from "leaflet";
import TheMap from "./StoryMap";
//@ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

const DerlaStory = () => {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(null);

  // This callback fires when a Step hits the offset threshold. It receives the
  // data prop of the step, which in this demo stores the index of the step.
  const onStepEnter = (obj) => {
    console.log(obj);
    setCurrentStepIndex(obj.data);
  };

  return (
    <>
      
        <TheMap 
          currentStepIndex={currentStepIndex}/>
      

        <Scrollama
          onStepEnter={onStepEnter}
          // debug
          root
          // How far from the top of the viewport to trigger a step (as a proportion of view height)
          offset={0.3}
        >
          {[1, 2, 3, 4, 5].map((_, stepIndex) => (
            <Step data={stepIndex} key={stepIndex}>
              <div
                style={{
                  margin: "100vh 0",
                  border: "1px solid gray",
                  opacity: currentStepIndex === stepIndex ? 1 : 0.2,
                }}
              >
                I'm a Scrollama Step of index {stepIndex}
              </div>
            </Step>
          ))}
          <Step data={6}>
            <div>
              <ContentHeading>Quantitative analysis</ContentHeading>
            </div>
          </Step>
          <Step data={7}>
            <p>hi</p>
          </Step>
        </Scrollama>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <p>~~~END OF SCROLLAMA TRACKING~~~</p>
    </>
  );
};

export default DerlaStory;
