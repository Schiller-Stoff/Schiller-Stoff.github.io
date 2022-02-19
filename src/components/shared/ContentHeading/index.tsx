import React from "react";

interface Props {
  children: string;
}

const ContentHeading: React.FC<Props> = (props) => {
  return (
    <h2 className="h3 bg-dark text-white p-1 d-inline">{props.children}</h2>
  );
};

export default ContentHeading;