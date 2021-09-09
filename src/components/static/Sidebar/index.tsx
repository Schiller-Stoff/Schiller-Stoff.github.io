import React from "react";

const Sidebar: React.FC = () => {

  const asideStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    padding: "20% .75em .75em .75em",
    minHeight: "100vh"
  }

  return (
    <aside 
      className="d-lg-block d-none shadow"
      style={asideStyle}>
      <a target="_blank" href="https://informationsmodellierung.uni-graz.at/en/">
        <img width={25} src="https://static.uni-graz.at/fileadmin/_processed_/1/3/csm_2018-11-22_ZIM_schwarz_typo3_24124f9364.png"></img>
      </a>
    </aside>)

}


export default Sidebar;