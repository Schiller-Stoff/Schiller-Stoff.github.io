import React from "react";

const StyleOverlay: React.FC = () => {
  return (
    <div
      style={{
        position:"absolute",
        zIndex:-1,
        top:0,
        right:0,
        height: "90vh",
        width:"105vh",
        background: "url('/illustrations/overlay.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderBottomRightRadius:"100px",
        borderBottomLeftRadius:"200px"
      }}
    >
      {/* <img src="/illustrations/dev.svg"></img> */}
    </div>
  );
};

export default StyleOverlay;
