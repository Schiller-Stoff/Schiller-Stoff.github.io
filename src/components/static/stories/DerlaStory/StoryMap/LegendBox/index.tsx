import React from "react";

interface Props {
  currentStepIndex?: number;
  isInitExpanded?: boolean; 
  content: {
    heading: string | JSX.Element;
    text?: string | JSX.Element
  }
}

const LegendBox: React.FC<Props> = ({
  currentStepIndex,
  isInitExpanded = false,
  content
}) => {

  const [isExpanded, setIsExpanded] = React.useState<boolean>(isInitExpanded)

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="p-1 ps-3 pe-3 m-0 btn text-start text-black"
      style={{
        position: "fixed",
        bottom: 0,
        zIndex: 9999,
        right: "0%",
        background: "white",
        maxWidth: "20%",
        border:"5px solid #8892b0",
        borderBottom:"none",
        borderRadius: 0
      }}
    >
      <strong className="text-dark">{content.heading}</strong>
      {isExpanded && <p>
        <small style={{color:"black"}}>{content.text}</small>
      </p>}
    </div>
  );
};

export default LegendBox;
