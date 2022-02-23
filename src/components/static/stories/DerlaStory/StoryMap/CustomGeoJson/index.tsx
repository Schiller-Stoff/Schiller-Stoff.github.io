import React from "react";
import {GeoJSON} from "react-leaflet"

interface Props {
  data: any
}

const CustomGeoJson: React.FC<Props> = (props) => {

  return <GeoJSON data={props.data}></GeoJSON>
}


export default CustomGeoJson;