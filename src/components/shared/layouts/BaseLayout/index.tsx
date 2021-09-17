import { Col, Container, Row } from "react-bootstrap";
import Footer from "../../../static/Footer";
import MyNav from "../../../static/Nav";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../styles/base.css";
import Sidebar from "../../../static/Sidebar";
import Head from "../../Head";
import StyleOverlay from "../../../static/EntryHero";

interface Props {
  headComponent?: JSX.Element;
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
      <StyleOverlay></StyleOverlay>
      <Row>
        <Col lg={2} className="d-none d-lg-block bg-secondary" as="aside">
          <Container>{props.left}</Container>
        </Col>
        <Col sm={12} lg={10} as="main">
          <Container>
          {props.children}
          </Container>
        </Col>
      </Row>
    <Footer></Footer>
  </>
);

export default BaseLayout;
