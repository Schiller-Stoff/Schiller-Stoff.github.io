import React from "react";

interface Props {
  currentStepIndex?: number;
}

const LegendBox: React.FC<Props> = (props) => {
  return (
    <p
      className="p-1 ps-3 pe-3 text-dark m-0"
      style={{
        position: "fixed",
        bottom: 0,
        zIndex: 9999,
        right: "0%",
        background: "white",
        maxWidth: "20%",
        border:"5px solid #789283"
        // opacity:.95
      }}
    >
      <strong>
        {props.currentStepIndex >= 1
          ? "Example places of remembrance"
          : "DERLA's area of research"}
      </strong>
      <p className="text-dark">
        <small>
          DERLA documents places of remembrances in the red areas. (Styria and
          Vorarlberg in today's Austria) Additionally this map shows the borders
          of the German Reich in 1941
        </small>
      </p>
    </p>
  );
};

export default LegendBox;
