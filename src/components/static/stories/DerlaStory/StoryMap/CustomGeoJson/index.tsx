import React from "react";
import { GeoJSON, useMap } from "react-leaflet";
import { GeoJsonObject } from "geojson"
import { PathOptions, StyleFunction } from "leaflet";

interface Props {
  data: GeoJsonObject;
  children?: any;
  style?: PathOptions | StyleFunction<any>;
  zoom?: number;
}

const CustomGeoJson: React.FC<Props> = (props) => {

  const geoJsonLayer = React.useRef(null);
  const map = useMap();

  /**
   * Sets view to the GeoJson layer when rendered.
   */
  React.useEffect(() => {
    if(!geoJsonLayer.current)return;
    map.setView(geoJsonLayer.current.getBounds().getCenter(), props.zoom)
  }, [])

  return <GeoJSON data={props.data} ref={geoJsonLayer} style={props.style}>{props.children}</GeoJSON>;
};

export default CustomGeoJson;
