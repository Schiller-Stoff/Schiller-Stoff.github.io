import { faBook, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "gatsby";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import BaseLayout from "../components/shared/layouts/BaseLayout";
import OrcidIconBar from "../components/shared/OrcidIconBar";
import OrcidTimeline from "../components/shared/OrcidTimeline";
import Timeline from "../components/shared/Timeline";
import StyleOverlay from "../components/static/EntryHero";
import { Orcid } from "../types/orcid";

const IndexPage: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> = (
  props
) => {
  return (
    <>
      <BaseLayout>
        <StyleOverlay></StyleOverlay>
        <h1 className="pt-md-5 h2" id="start">
          Hi, I'm{" "}
          <span className="text-decoration-underline">
            {props.pageContext.persOrcid.person.name["given-names"].value}{" "}
            {props.pageContext.persOrcid.person.name["family-name"].value}
          </span>
        </h1>
        <h2 className="text-secondary h4">
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
        <Row>
          <Col md={6} className="shadow p-3">
            <Row>
              <Col md={5}>
                {/* <Button variant="secondary">Request meeting</Button> */}
                <img
                  src="/img/profile.jpg"
                  width={250}
                  height={250}
                  style={{ borderRadius: "100%", filter: "grayscale(150%)" }}
                ></img>
              </Col>
              <Col md={7}>
                <h3 className="h5">My page</h3>
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
          <Col md={2}>
            <h3 className="h5 mt-md-3">My background</h3>
            <ul style={{listStyle:"none", marginLeft: "-1em"}}>
              {props.pageContext.persOrcid.person.keywords.keyword.map(
                (kword) => (
                  <li><small><FontAwesomeIcon className="text-dark" icon={faBook}></FontAwesomeIcon>{" " + kword.content}</small></li>
                )
              )}
            </ul>
          </Col>
          <Col>
            <h3 className="h5 mt-md-3">My links</h3>
            <ul style={{listStyle:"none", marginLeft: "-1em"}}>
              {props.pageContext.persOrcid.person["researcher-urls"][
                "researcher-url"
              ].map((rurl) => (
                <li>
                  <small><FontAwesomeIcon className="text-dark" icon={faLink}></FontAwesomeIcon><a target="_blank" className="text-dark" href={rurl.url.value.toString()}>
                    {" " + rurl["url-name"]}
                  </a></small>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
        <br />
        <OrcidIconBar 
          orcidURL={props.pageContext.persOrcid["orcid-identifier"].uri} 
          researchURLs={props.pageContext.persOrcid.person["researcher-urls"]["researcher-url"]} 
          mail={props.pageContext.persOrcid.person.emails.email[0].email}
        />
        <br />
        <Link to="#cv"><Button variant="dark me-2">CV</Button></Link>
            <Link to="#employments"><Button variant="dark me-2">Employments</Button></Link>
            <Link to="#educations"><Button variant="dark me-2">Education</Button></Link>
            <Link to="#works"><Button variant="dark me-2">Works</Button></Link>
            <a href={`mailto:${props.pageContext.persOrcid.person.emails.email[0].email}`}><Button variant="warning me-2">Contact me !</Button></a>
        
        <br />
        <br />
        <Row>
          <Col md={7}>
            <h2 id="cv" className="h3">CV / Biography</h2>
            <p>{props.pageContext.persOrcid.person.biography.content}</p>
            <br />
            <br />
            <h2 className="h3" id="employments">Current and passed employments</h2>
            <p>Defined by the ORCID ontology: Employment is a formal employment relationship with an organization, e.g. staff, intern, researcher, contractor. Employment can be paid or unpaid.</p>
            <OrcidTimeline
              orcidSequence={
                props.pageContext.persOrcid["activities-summary"].employments
              }
              mode="VERTICAL_ALTERNATING"
            ></OrcidTimeline>
            <br />
            <br />
            <br />

            <h2 className="h3" id="educations">Education and qualifications</h2>
            <p>Education is participation in an academic higher education program to receive an undergraduate, graduate, or other degree.
              Qualification is participation in a professional or vocational accreditation, certification, or training program. Both may be in progress or unfinished.</p>
            <OrcidTimeline
              mode="VERTICAL_ALTERNATING"
              orcidSequence={
                props.pageContext.persOrcid["activities-summary"].educations
              }
            ></OrcidTimeline>
            <br></br>
            <br></br>
            <br></br>
            <h2 className="h3" id="works">Works: Things I have accomplished</h2>
            <p>ORCID defines works as your research outputs, including publications, data sets, conference presentations, and more.</p>
            <Container>
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
                        <p style={{ position: "relative", left: "-110px", fontWeight: 600 }}>{props.data.title}</p>
                        <a className="text-secondary" target="_blank" href={orcidData && orcidData["external-ids"]["external-id"][0] && orcidData["external-ids"]["external-id"][0]["external-id-url"].value.toString()}>{orcidData["external-ids"]["external-id"][0] && "Visit related project page"}</a>
                      </Container>
                    )
                  }}
              </OrcidTimeline>
            </Container>



          </Col>
          <Col>


          </Col>
        </Row>
        <br></br>
        <br></br>
        <br></br>





      </BaseLayout>
    </>
  );
};

export default IndexPage;
