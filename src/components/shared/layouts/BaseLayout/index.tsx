import { Container } from "react-bootstrap";
import Footer from "../../../static/Footer";
import MyNav from "../../../static/Nav";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../styles/base.css";
import Sidebar from "../../../static/Sidebar";
import Head from "../../Head";

interface Props {
  headComponent?: JSX.Element;
  nav?: JSX.Element;
}

/**
 * BaseLayout component of page
 * @param props
 * @returns
 */
const BaseLayout: React.FC<Props> = (props) => (
  <>
    {props.headComponent ? props.headComponent : <Head />}
    {props.nav ? props.nav : <MyNav />}
    <Sidebar></Sidebar>
    <Container className="min-vh-100 px-md-3" as="main">
      {props.children}
    </Container>
    <Footer></Footer>
  </>
);

export default BaseLayout;
