import { Container } from "react-bootstrap";
import Footer from "../../../static/Footer";
import MyNav from "../../../static/Nav";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../../styles/base.css';
import Sidebar from "../../../static/Sidebar";
import Head from "../../Head";

interface Props {
  headComponent?: JSX.Element
}

const BaseLayout: React.FC<Props> = (props) => (
  <>
    {props.headComponent ? props.headComponent : <Head/>}
    <MyNav></MyNav>
    <Sidebar></Sidebar>
    <Container className="min-vh-100 mt-md-2 pt-5 px-md-3" as="main"><br/>{props.children}</Container>
    <Footer></Footer>
  </>
);

export default BaseLayout;
