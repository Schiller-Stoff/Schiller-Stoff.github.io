import {Link} from "gatsby";
import { Col, Container, Row } from "react-bootstrap";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-top">
      <Container className="p-md-5">
        <Row>
          <Col md={6}>
            <h4>Weitere Information</h4>
            <Link to="/imprint">Impressum</Link>
            <br></br>
            <Link to="/dataprotection">Datenschutz</Link>
            <br></br>
            <br></br>
            <p>Sebastian Stoff | © 2017 | All Rights Reserved</p>
          </Col>
          <Col md={6}>
            <h4>Kontakt</h4>
           
          </Col>
        </Row>
        
      </Container>
    </footer>
  );
};

export default Footer;
