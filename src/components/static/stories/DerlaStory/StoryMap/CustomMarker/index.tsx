import React from "react";
import { Marker, Popup, useMap, useMapEvent } from "react-leaflet";

interface Props {
  isActive?: boolean;
  data: any;
  children?: any
}

const CustomMarker: React.FC<Props> = ({ isActive, data, children}) => {
  let popupRef = React.useRef(null);

  const map = useMap();
  const lmap = useMapEvent('popupopen', (e) => {
    console.log("POPUP OPEN")
    var px = lmap.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.target._popup._container.clientHeight/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    setTimeout(() => {
      lmap.panTo(lmap.unproject(px),{animate: true})
    },1); // pan to new center
    return false;
  });

  React.useEffect(() => {
    if (isActive) {
      // map.zoomIn();
      if(!popupRef.current)return;
      setTimeout(() => map.openPopup(popupRef.current), 1)
    }
  }, [isActive]);

  return (
    <Marker position={data.position}>
      <Popup
        className="request-popup"
        ref={popupRef}
      >
        {children}
      </Popup>
    </Marker>
  );
};

export default CustomMarker;