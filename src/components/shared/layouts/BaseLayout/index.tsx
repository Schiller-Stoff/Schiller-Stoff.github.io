import { Col, Container, Row } from "react-bootstrap";
import Footer from "../../../static/Footer";
import MyNav from "../../../static/Nav";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../styles/base.css";
import Sidebar from "../../../static/Sidebar";
import Head from "../../Head";
import StyleOverlay from "../../../static/EntryHero";
import OrcidSideNav from "../../OrcidSideNav";
import { Orcid } from "../../../../types/orcid";
import OrcidNav from "../../OrcidNav";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

interface Props {
  headComponent?: JSX.Element;
  orcidRoot?: Orcid.RootObject;
  nav?: JSX.Element;
  left?: JSX.Element;
  navProps?: {
    title: string
  }
}

/**
 * BaseLayout component of page
 * @param props
 * @returns
 */
const BaseLayout: React.FC<Props> = (props) => (
  <>
    {props.headComponent ? props.headComponent : <Head />}
    {/* {props.nav ? props.nav : <MyNav {...props.navProps}/>} */}
    {/* <Sidebar></Sidebar> */}
    {/* <StyleOverlay></StyleOverlay>*/}
    
    {props.orcidRoot && (
      <>
        <OrcidSideNav orcidRoot={props.orcidRoot}/>
        <OrcidNav orcidRoot={props.orcidRoot}></OrcidNav>
      </>
    )}
    <Container id="baseLayout_mainContainer">
      <br />
      {props.children}
      <Footer></Footer>
    </Container>
    
  </>
);

export default BaseLayout;
