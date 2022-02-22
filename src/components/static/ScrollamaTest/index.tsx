import React from "react";
//@ts-ignore
import { Scrollama, Step } from "react-scrollama";

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
      <div style={{ border: "2px dashed skyblue" }}>
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
      </div>
    </>
  );
};

export default ScrollamaTest;
