import React from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  GeoJSON,
} from "react-leaflet";
import { derlaData } from "../../../../../data/derla";
import CustomGeoJson from "./CustomGeoJson";
import CustomMarker from "./CustomMarker";

interface Props {
  currentStepIndex: number;
}

const TheMap: React.FC<Props> = (props) => {
  React.useEffect(() => {
    if (!props.currentStepIndex) return;

    if (props.currentStepIndex === 2) {
      // popupRef.current.openOn(map);
    }
  }, [props.currentStepIndex]);

  const geojsonFeature = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [66.09375, 56.9449741808516],
              [34.453125, 33.7243396617476],
              [91.0546875, 9.44906182688142],
              [90, 40.44694705960048],
              [66.09375, 56.9449741808516],
            ],
          ],
        },
      },
    ],
  };

  const geojsonFeatureComplex = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [6.9873046875, 53.56641415275043],
              [7.207031249999999, 52.696361078274485],
              [6.591796875, 52.05249047600099],
              [5.888671875, 51.80861475198521],
              [5.80078125, 51.01375465718821],
              [6.416015625, 50.28933925329178],
              [6.1962890625, 50.00773901463687],
              [6.50390625, 49.32512199104001],
              [8.4375, 48.8936153614802],
              [7.6025390625, 47.39834920035926],
              [8.7890625, 47.754097979680026],
              [10.0634765625, 47.39834920035926],
              [9.7119140625, 47.07012182383309],
              [10.986328125, 46.6795944656402],
              [12.041015625, 47.100044694025215],
              [12.392578125, 46.619261036171515],
              [13.623046875, 46.5286346952717],
              [14.150390625, 46.042735653846506],
              [15.468749999999998, 46.13417004624326],
              [16.1279296875, 46.800059446787316],
              [16.5234375, 47.39834920035926],
              [16.69921875, 47.81315451752768],
              [17.138671875, 48.07807894349862],
              [17.0068359375, 48.69096039092549],
              [18.80859375, 49.5822260446217],
              [20.390625, 49.15296965617042],
              [22.5, 49.210420445650286],
              [23.73046875, 49.210420445650286],
              [22.8515625, 50.064191736659104],
              [23.90625, 50.401515322782366],
              [22.763671875, 52.96187505907603],
              [21.09375, 53.54030739150022],
              [22.939453125, 54.36775852406841],
              [22.5, 55.07836723201515],
              [21.357421875, 55.3791104480105],
              [19.951171875, 54.87660665410869],
              [19.599609375, 54.265224078605684],
              [18.45703125, 54.265224078605684],
              [18.28125, 54.826007999094955],
              [14.94140625, 53.9560855309879],
              [14.414062499999998, 53.69670647530323],
              [13.271484375, 54.41892996865827],
              [11.162109375, 54.16243396806779],
              [10.37109375, 54.41892996865827],
              [9.84375, 54.77534585936447],
              [8.7890625, 54.87660665410869],
              [9.140625, 54.059387886623576],
              [7.91015625, 53.64463782485651],
              [6.9873046875, 53.56641415275043],
            ],
          ],
        },
      },
    ],
  };

  const onEachCountry = (country, layer) => {
    console.log(layer);
    //const countryName = country.properties.ADMIN;
    //console.log(countryName);
    //layer.bindPopup(countryName);

    layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
    // const colorIndex = Math.floor(Math.random() * this.colors.length);
    // layer.options.fillColor = this.colors[colorIndex]; //0

    // layer.on({
    //   click: this.changeCountryColor,
    // });
  };

  const style = (feature) => {
    return {
      // fillColor: "black",
      weight: 6,
      // opacity: 1,
      // color: 'blue',
      // dashArray: '3',
      fillOpacity: 0,
    };
  };

  return (
    <MapContainer
      center={[47.449358, 15.297192]}
      zoom={5}
      style={{
        height: "100vh",
        backgroundColor: "whitesmoke",
        marginTop: "80px",
        marginBottom: "90px",
      }}
      touchZoom={false}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
      />
      {/* <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Marker position={[51.205, -0.09]}>
        <Popup ref={popupRef}>
          Another marker. <br /> Easily customizable.
        </Popup>
      </Marker> */}
      <CustomMarker
        isActive={props.currentStepIndex === 1}
        data={{
          position: [47.449358, 15.297192],
        }}
      >
        <div style={{ filter: "grayscale(1)" }}>
          <p>... like this one</p>
          <a
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty12/methods/sdef:TEI/get?locale=de"
            target="_blank"
          >
            <p className="h5">Platz benannt nach Maximilian Haitzmann</p>
            <img
              src="https://gams.uni-graz.at/archive/objects/o:derla.sty12/datastreams/IMAGE.2/content"
              width={100}
              height={100}
              loading="lazy"
            ></img>
          </a>
        </div>
      </CustomMarker>
      <CustomMarker
        isActive={props.currentStepIndex === 2}
        data={{
          position: [46.681457, 15.074161],
        }}
      >
        <div style={{ filter: "grayscale(1)" }}>
          <p>... or this one</p>
          <a
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty20/methods/sdef:TEI/get?locale=de"
            target="_blank"
          >
            <p className="h5">
              Grave site for partisans killed in action against German units
            </p>
            <img
              src="https://gams.uni-graz.at/archive/objects/o:derla.sty20/datastreams/IMAGE.1/content"
              width={100}
              height={100}
              loading="lazy"
            ></img>
          </a>
        </div>
      </CustomMarker>
      <CustomMarker
        isActive={props.currentStepIndex === 3}
        data={{
          position: [46.823364, 15.059047],
        }}
      >
        <div style={{ filter: "grayscale(1)" }}>
          <p>... or this one</p>
          <a
            href="https://gams.uni-graz.at/archive/objects/o:derla.sty21/methods/sdef:TEI/get?locale=de"
            target="_blank"
          >
            <p className="h5">Tomb in memory of Karl Spindler</p>
            <img
              src="https://gams.uni-graz.at/archive/objects/o:derla.sty21/datastreams/IMAGE.1/content"
              width={100}
              height={100}
              loading="lazy"
            ></img>
          </a>
        </div>
      </CustomMarker>

      {/* <GeoJSON
      data={derlaData.overviewGEOJSON as any} onEachFeature={onEachCountry} attribution="nice" key="1" style={style}></GeoJSON> */}

      <GeoJSON data={geojsonFeatureComplex as any} style={style}>
        <Popup>German Reich in 1941</Popup>
      </GeoJSON>
      {/* <CustomGeoJson data={geojsonFeatureComplex}></CustomGeoJson> */}
    </MapContainer>
  );
};

export default TheMap;
