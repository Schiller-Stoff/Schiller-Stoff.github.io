import {Link} from "gatsby";
import { Col, Container, Row } from "react-bootstrap";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-top">
      <Container className="p-md-5">
        <Row>
          <Col md={6}>
            <h4>Additional information</h4>
            <br />
            <Link to="/imprint">Imprint</Link>
            <br></br>
            <Link to="/imprint">Data protection</Link>
            <br></br>
            <br></br>
          </Col>
          <Col md={6}>
            {/* <h4>Contact</h4> */}
           
          </Col>
        </Row>
        
      </Container>
    </footer>
  );
};

export default Footer;
