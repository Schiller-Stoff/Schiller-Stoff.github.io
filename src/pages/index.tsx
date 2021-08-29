
import React from "react";
import { Col, Row } from "react-bootstrap";
import BaseLayout from "../components/shared/layouts/BaseLayout";
import StyleOverlay from "../components/static/EntryHero";

const IndexPage: React.FC = () => {
  return (
    <>
    
    <BaseLayout>
      <StyleOverlay></StyleOverlay>
      <Row>
        <Col md={6}>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <h1>Hi my name is Sebastian Stoff!</h1>
        </Col>
        <Col md={6}>
          <br></br>
          <br></br>
          <br></br>
          <img src="/illustrations/dev.svg" style={{maxWidth:"35vw"}}></img>
        </Col>
      </Row>
    </BaseLayout>
    </>
  )
}

export default IndexPage
