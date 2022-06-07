import React from "react";

interface Props {
  label: string;
  href: string;
  imgSrc?: string;
}

const CustomPopup: React.FC<Props> = (props) => {
  return (
    <div style={{ filter: "grayscale(1)" }}>
      <a href={props.href} target="_blank">
        <p className="h5 text-dark">{props.label}</p>
        {props.imgSrc && (
          <img src={props.imgSrc} width={200} height={200} loading="lazy"></img>
        )}
      </a>
    </div>
  );
};

export default CustomPopup;
