import { faBook, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "gatsby";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import BaseLayout from "../components/shared/layouts/BaseLayout";
import OrcidEntry from "../components/shared/OrcidEntry";
import OrcidIconBar from "../components/shared/OrcidIconBar";
import OrcidProfileCard from "../components/shared/OrcidProfileCard";
import OrcidTimeline from "../components/shared/OrcidTimeline";
import Timeline from "../components/shared/Timeline";
import StyleOverlay from "../components/static/EntryHero";
import { Orcid } from "../types/orcid";
import MyStringUtils from "../utils/MyStringUtils";

const IndexPage: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> = (
  props
) => {
  return (
    <>
      <BaseLayout>
        <StyleOverlay></StyleOverlay>
        <OrcidEntry orcidRoot={props.pageContext.persOrcid}></OrcidEntry>
        <OrcidProfileCard orcidRoot={props.pageContext.persOrcid}/>
        <br />
        <OrcidIconBar 
          orcidURL={props.pageContext.persOrcid["orcid-identifier"].uri} 
          researchURLs={props.pageContext.persOrcid.person["researcher-urls"]["researcher-url"]} 
          mail={props.pageContext.persOrcid.person.emails.email[0] && props.pageContext.persOrcid.person.emails.email[0].email}
        />
        <br />
        <Link to="#cv"><Button variant="dark me-2">CV</Button></Link>
            <Link to="#employments"><Button variant="dark me-2">Employments</Button></Link>
            <Link to="#educations"><Button variant="dark me-2">Education</Button></Link>
            <Link to="#works"><Button variant="dark me-2">Works</Button></Link>
            {props.pageContext.persOrcid.person.emails.email[0] && <a href={`mailto:${props.pageContext.persOrcid.person.emails.email[0].email}`}><Button variant="warning me-2">Contact me !</Button></a>}
        
        <br />
        <br />
        <Row>
          <Col md={7}>
            {props.pageContext.persOrcid.person.biography && <div className="shadow p-3 bg-white">
              <h2 id="cv" className="h3">CV / Biography</h2>
              <p>{props.pageContext.persOrcid.person.biography.content}</p>
            </div>}
            <br />
            <br />
            <h2 className="h3" id="employments">Current and past employments</h2>
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

            {props.pageContext.persOrcid["activities-summary"].educations["last-modified-date"] && (<><h2 className="h3" id="educations">Education and qualifications</h2>
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
            <br></br></>)}
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
                        <a className="text-secondary" target="_blank" href={ MyStringUtils.catchToString(() => orcidData["external-ids"]["external-id"][0]["external-id-url"].value.toString())}>{orcidData["external-ids"]["external-id"][0] && "Visit related project page"}</a>
                      </Container>
                    )
                  }}
              </OrcidTimeline>
            </Container>



          </Col>
          <Col >


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
