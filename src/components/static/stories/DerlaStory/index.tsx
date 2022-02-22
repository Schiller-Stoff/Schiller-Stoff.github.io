import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
//@ts-ignore
import { Scrollama, Step } from "react-scrollama";
import "leaflet/dist/leaflet.css";

const ScrollamaTest = () => {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(null);

  // This callback fires when a Step hits the offset threshold. It receives the
  // data prop of the step, which in this demo stores the index of the step.
  const onStepEnter = (obj) => {
    console.log(obj);
    setCurrentStepIndex(obj.data);
  };

  return (
    <>
      <div id="map" style={{ height: "600px", width: "600px" }}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{
            height: "400px",
            backgroundColor: "red",
            marginTop: "80px",
            marginBottom: "90px",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]} >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      {/* <div style={{ border: "2px dashed skyblue" }}>
        <div style={{ position: "sticky", top: 0, border: "1px solid orchid" }}>
          I'm sticky. The current triggered step index is: {currentStepIndex}
        </div>

        <Scrollama
          onStepEnter={onStepEnter}
          debug
          root
          // How far from the top of the viewport to trigger a step (as a proportion of view height)
          offset={0.3}
        >
          {[1, 2, 3, 4].map((_, stepIndex) => (
            <Step data={stepIndex} key={stepIndex}>
              <div
                style={{
                  margin: "50vh 0",
                  border: "1px solid gray",
                  opacity: currentStepIndex === stepIndex ? 1 : 0.2,
                }}
              >
                I'm a Scrollama Step of index {stepIndex}
              </div>
            </Step>
          ))}
        </Scrollama>
      </div> */}
    </>
  );
};

export default ScrollamaTest;
