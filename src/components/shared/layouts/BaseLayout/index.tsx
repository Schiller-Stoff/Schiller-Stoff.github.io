import { Container } from "react-bootstrap";
import Footer from "../../../static/Footer";
import MyNav from "../../../static/Nav";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


const BaseLayout: React.FC = (props) => (
  <>
    <MyNav></MyNav>
    <Container className="min-vh-100" as="main">{props.children}</Container>
    <Footer></Footer>
  </>
);

export default BaseLayout;
