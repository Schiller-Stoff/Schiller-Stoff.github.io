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
          {[1, 2, 3, 4, 5,6,7,8,9,10].map((_, stepIndex) => (
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
          <Step data={11}>
            <div>
              <ContentHeading>Thank you for your attention!</ContentHeading>
              <p>Check out the links down below for more details about DERLA.</p>
              <ul>
                <li>
                  <a href="https://gams.uni-graz.at/context:derla" target="_blank">DERLA homepage</a>
                </li>
                <li>
                  <a href="https://gams.uni-graz.at/archive/objects/context:derla/methods/sdef:Context/get?mode=about" target="_blank">DERLA project description</a>
                </li>
                <li>
                  <a href="https://gams.uni-graz.at/" target="_blank">GAMS</a>
                </li>
              </ul>
            </div>
          </Step>
          <Step data={12}>
            <br></br>
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
