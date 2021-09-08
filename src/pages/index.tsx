import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import BaseLayout from "../components/shared/layouts/BaseLayout";
import OrcidTimeline from "../components/shared/OrcidTimeline";
import Timeline from "../components/shared/Timeline";
import StyleOverlay from "../components/static/EntryHero";
import { Orcid } from "../types/orcid";

const IndexPage: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> = (
  props
) => {
  console.log(props);

  return (
    <>
      <BaseLayout>
        <StyleOverlay></StyleOverlay>
        <Row>
          <Col md={6}>
            <h1 className="pt-md-5 mt-4">
              Hi, I'm{" "}
              <span className="text-decoration-underline">
                {props.pageContext.persOrcid.person.name["given-names"].value}{" "}
                {props.pageContext.persOrcid.person.name["family-name"].value}
              </span>
            </h1>
            <h2 className="text-secondary h3">
              {
                props.pageContext.persOrcid["activities-summary"].employments[
                "employment-summary"
                ][0]["role-title"]
              }{" "}
              at{" "}
              {
                props.pageContext.persOrcid["activities-summary"].employments[
                  "employment-summary"
                ][0].organization.name
              }
            </h2>
            <br></br>
            <Row>
              <Col md={5}>
                {/* <Button variant="secondary">Request meeting</Button> */}
                <img
                  src="/img/profile.jpg"
                  width={200}
                  height={200}
                  style={{ borderRadius: "100%", filter: "grayscale(150%)" }}
                ></img>
              </Col>
              <Col md={7}>
                <br></br>
                <ul>
                  <li>
                    <small>
                      This page is based on data provided by the ORCID public
                      API and rendered by Gatsby.js based on React.
                    </small>
                  </li>
                  <li>
                    <small>
                      The CV template page is maintained by the DH-Frontend
                      Group in Graz Austria.
                    </small>
                  </li>
                  <li>
                    <small>
                      <a
                        target="_blank"
                        href={
                          props.pageContext.persOrcid["orcid-identifier"].uri
                        }
                      >
                        Find me on ORCID
                      </a>
                    </small>
                  </li>
                  {/* <img src="/img/profile.jpg" width={150} height={150} style={{borderRadius: "100%", filter: "grayscale(150%)"}}></img> */}
                </ul>
              </Col>
            </Row>
          </Col>
          <Col md={6}>
            <br></br>
            <br></br>
            <br></br>
            <h2 className="h4">My background</h2>
            <ul>
              {props.pageContext.persOrcid.person.keywords.keyword.map(
                (kword) => (
                  <li>{kword.content}</li>
                )
              )}
            </ul>
            <br></br>
            <h2 className="h4">Links</h2>
            <ul>
              {props.pageContext.persOrcid.person["researcher-urls"][
                "researcher-url"
              ].map((rurl) => (
                <li>
                  <a target="_blank" href={rurl.url.value}>
                    {rurl["url-name"]}
                  </a>
                </li>
              ))}
            </ul>
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
            <OrcidTimeline
              orcidSequence={
                props.pageContext.persOrcid["activities-summary"].employments
              }
              mode="VERTICAL_ALTERNATING"
            ></OrcidTimeline>
          </Col>
          <Col>
            <br></br>
            <h3 className="h5">Biography</h3>
            <p>{props.pageContext.persOrcid.person.biography.content}</p>
          </Col>
        </Row>
        <br />
        <br />
        <br />
        <br />

        <h2 className="h3">Education and qualifications</h2>
        <Row className="bg-light">
          <Col md={4}>
            <br />

            <p>List of completed studies and related things to university...</p>
          </Col>
          <Col md={8}>
            <OrcidTimeline
              mode="VERTICAL"
              orcidSequence={
                props.pageContext.persOrcid["activities-summary"].educations
              }
            ></OrcidTimeline>
          </Col>
        </Row>
        <br></br>
        <br></br>
        <br></br>

        <h2>Things I have accomplished</h2>
        <Container className="bg-light">
          <OrcidTimeline
            orcidSequence={props.pageContext.persOrcid["activities-summary"].works}
            mode="VERTICAL_ALTERNATING"
          >
            {
              //passing through custom component to render link correctly
              (props) => {
                const orcidData = props.data.orcidData as Orcid.WorkSummary
                return (
                  <Container style={{ position: "absolute" }}>
                    <h4 className="h6 fw-bold">{props.data.cardTitle}</h4>
                    <p>{props.data.cardSubtitle.replace("OTHER", "SOFTWARE").replace("DISSERTATION", "THESIS")}</p>
                    <p style={{ position: "relative", left: "-125px", fontWeight: 600 }}>{props.data.title}</p>
                    <br />
                    <a className="text-secondary" target="_blank" href={orcidData && orcidData["external-ids"]["external-id"][0] && orcidData["external-ids"]["external-id"][0]["external-id-url"].value.toString()}>{orcidData["external-ids"]["external-id"][0] && "Visit related project page"}</a>
                  </Container>
                )
              }}
          </OrcidTimeline>
        </Container>



      </BaseLayout>
    </>
  );
};

export default IndexPage;
