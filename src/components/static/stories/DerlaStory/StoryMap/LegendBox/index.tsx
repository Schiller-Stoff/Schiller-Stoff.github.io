import React from "react";

interface Props {
  currentStepIndex?: number;
  content: {
    heading: string;
    text?: string
  }
}

const LegendBox: React.FC<Props> = (props) => {

  const [isExpanded, setIsExpanded] = React.useState<boolean>(false)

  return (
    <div
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
      }}
    >
      <strong>{props.content.heading}</strong>
      {isExpanded && <p className="text-dark">
        <small>{props.content.text}</small>
      </p>}
    </div>
  );
};

export default LegendBox;
