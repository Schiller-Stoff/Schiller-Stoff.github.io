
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import BaseLayout from "../components/shared/layouts/BaseLayout";
import Timeline from "../components/shared/Timeline";
import StyleOverlay from "../components/static/EntryHero";
import { Orcid } from "../types/orcid";

const IndexPage: React.FC<{pageContext: {persOrcid: Orcid.RootObject}}> = (props) => {

  console.log(props);

  return (
    <>
    <BaseLayout>
      <StyleOverlay></StyleOverlay>
      <Row>
        <Col md={6}>
          <h1 className="pt-md-5 mt-4">Hi, I'm <span className="text-decoration-underline">{props.pageContext.persOrcid.person.name["given-names"].value} {props.pageContext.persOrcid.person.name["family-name"].value}</span></h1>
          <h2 className="text-secondary h3">{props.pageContext.persOrcid["activities-summary"].employments["employment-summary"][0]["role-title"]} at {props.pageContext.persOrcid["activities-summary"].employments["employment-summary"][0].organization.name}</h2>
          <br></br>
          <Row>
            <Col md={5}>
              {/* <Button variant="secondary">Request meeting</Button> */}
              <img src="/img/profile.jpg" width={200} height={200} style={{borderRadius: "100%", filter: "grayscale(150%)"}}></img>
            </Col>
            <Col md={7}>
              <br></br>
              <ul>
              <li><small>This page is based on data provided by the ORCID public API and rendered by Gatsby.js based on React.</small></li>
              <li><small>The CV template page is maintained by the DH-Frontend Group in Graz Austria.</small></li>
              <li><small><a target="_blank" href={props.pageContext.persOrcid["orcid-identifier"].uri}>Find me on ORCID</a></small></li>
              {/* <img src="/img/profile.jpg" width={150} height={150} style={{borderRadius: "100%", filter: "grayscale(150%)"}}></img> */}
              </ul>
            </Col>
          </Row>
          
        </Col>
        <Col md={6}>
          <br></br>
          <br></br>
          <br></br>
          {/* <img src="/illustrations/dev.svg" style={{maxWidth:"20vw"}}></img> */}
        </Col>
      </Row>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h2 className="h3">Curriculum Vitae</h2>
      
        <Row>
          <Col md={6}>
            <Timeline></Timeline>
          </Col>
          <Col>
            <br></br>
            <h3 className="h5">Biography</h3>
            <p>{props.pageContext.persOrcid.person.biography.content}</p>
          </Col>
        </Row>
        
      
    </BaseLayout>
    </>
  )
}

export default IndexPage
