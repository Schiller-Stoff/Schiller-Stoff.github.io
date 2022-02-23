import React from "react";

interface Props {
  currentStepIndex?: number;
}

const LegendBox: React.FC<Props> = (props) => {

  const [isExpanded, setIsExpanded] = React.useState<boolean>(false)

  return (
    <p
      onClick={() => setIsExpanded(!isExpanded)}
      className="p-1 ps-3 pe-3 text-dark m-0 btn text-start"
      style={{
        position: "fixed",
        bottom: 0,
        zIndex: 9999,
        right: "0%",
        background: "white",
        maxWidth: "20%",
        border:"3px solid #789283",
        borderBottom:"none"
        // opacity:.95
      }}
    >
      <strong>
        {props.currentStepIndex >= 1
          ? "Example places of remembrance"
          : "DERLA's area of research"}
      </strong>
      {isExpanded && <p className="text-dark">
        <small>
          DERLA documents places of remembrances in the red areas. (Styria and
          Vorarlberg in today's Austria) Additionally this map shows the borders
          of the German Reich in 1941
        </small>
      </p>}
    </p>
  );
};

export default LegendBox;
