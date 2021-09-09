import { Container } from "react-bootstrap";
import Footer from "../../../static/Footer";
import MyNav from "../../../static/Nav";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../../styles/base.css';
import Sidebar from "../../../static/Sidebar";

const BaseLayout: React.FC = (props) => (
  <>
    <MyNav></MyNav>
    <Sidebar></Sidebar>
    <Container className="min-vh-100 mt-md-2 px-md-5 shadow" as="main">{props.children}</Container>
    <Footer></Footer>
  </>
);

export default BaseLayout;
