import { Link } from "gatsby";
import React from "react";
import { Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import BaseLayout from "../components/shared/layouts/BaseLayout";
import OrcidEntry from "../components/shared/OrcidEntry";
import OrcidHead from "../components/shared/OrcidHead";
import OrcidIconBar from "../components/shared/OrcidIconBar";
import OrcidNav from "../components/shared/OrcidNav";
import OrcidProfileCard from "../components/shared/OrcidProfileCard";
import OrcidTimeline from "../components/shared/OrcidTimeline";
import StyleOverlay from "../components/static/EntryHero";
import { Orcid } from "../types/orcid";
import MyStringUtils from "../utils/MyStringUtils";

const IndexPage: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> = (
  props
) => {
  return (
    <>
      <BaseLayout
        headComponent={<OrcidHead orcidRoot={props.pageContext.persOrcid} />}
        nav={<OrcidNav orcidRoot={props.pageContext.persOrcid} />}
      >
        <StyleOverlay></StyleOverlay>
        <br/>
        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3 w-50">
          <Tab eventKey="home" title="Academic Style">
          <OrcidEntry orcidRoot={props.pageContext.persOrcid}></OrcidEntry>
        <OrcidProfileCard orcidRoot={props.pageContext.persOrcid} />
        <br />
        <OrcidIconBar
          orcidURL={props.pageContext.persOrcid["orcid-identifier"].uri}
          researchURLs={
            props.pageContext.persOrcid.person["researcher-urls"][
            "researcher-url"
            ]
          }
          mail={
            props.pageContext.persOrcid.person.emails.email[0] &&
            props.pageContext.persOrcid.person.emails.email[0].email
          }
        />
        {props.pageContext.persOrcid.person.emails.email[0] && (
          <>
            <a
              href={`mailto:${props.pageContext.persOrcid.person.emails.email[0].email}`}
            >
              <Button variant="warning me-2 mt-3">Get in touch</Button>
            </a>
            <br />
          </>
        )}
        <br />
        <br />
        <hr className="w-50"/>
        <Row>
          <Col md={12} lg={10} xl={8}>
            {props.pageContext.persOrcid.person.biography && (
              <>
                <h2 id="biography" className="h3 mt-md-5">
                  CV / Biography
                </h2>
                <p className="">{props.pageContext.persOrcid.person.biography.content}</p>
              </>
            )}
            <br />
            <br />
            <h2 className="h3" id="employments">
                Current and past employments
              </h2>
            <div>
              
              <p>
                Defined by the ORCID ontology: Employment is a formal employment
                relationship with an organization, e.g. staff, intern,
                researcher, contractor. Employment can be paid or unpaid.
              </p>
            </div>
            <OrcidTimeline
              orcidSequence={
                props.pageContext.persOrcid["activities-summary"].employments
              }
              mode="VERTICAL_ALTERNATING"
            ></OrcidTimeline>
            <br />
            <br />
            <br />

            {props.pageContext.persOrcid["activities-summary"].educations[
              "last-modified-date"
            ] && (
                <div className="px-3">
                  <h2 className="h3" id="educations">
                    Education and qualifications
                  </h2>
                  <p>
                    Education is participation in an academic higher education
                    program to receive an undergraduate, graduate, or other
                    degree. Qualification is participation in a professional or
                    vocational accreditation, certification, or training program.
                    Both may be in progress or unfinished.
                  </p>
                  <OrcidTimeline
                    mode="VERTICAL_ALTERNATING"
                    orcidSequence={
                      props.pageContext.persOrcid["activities-summary"].educations
                    }
                  ></OrcidTimeline>
                  <br></br>
                  <br></br>
                  <br></br>
                </div>
              )}
            <h2 className="h3" id="works">
              Works: Things I have accomplished
            </h2>
            <p>
              ORCID defines works as your research outputs, including
              publications, data sets, conference presentations, and more.
            </p>
            <Container>
              <OrcidTimeline
                orcidSequence={
                  props.pageContext.persOrcid["activities-summary"].works
                }
                mode="VERTICAL_ALTERNATING"
              >
                {
                  //passing through custom component to render link correctly
                  (props) => {
                    const orcidData = props.data.orcidData as Orcid.WorkSummary;
                    return (
                      <Container style={{ position: "absolute" }}>
                        <h4 className="h6 fw-bold">{props.data.cardTitle}</h4>
                        <p>
                          {props.data.cardSubtitle
                            .replace("OTHER", "SOFTWARE")
                            .replace("DISSERTATION", "THESIS")}
                        </p>
                        <p
                          style={{
                            position: "relative",
                            left: "-110px",
                            fontWeight: 600,
                          }}
                        >
                          {props.data.title}
                        </p>
                        {() => {
                          let href = MyStringUtils.catchToString(() =>
                            orcidData["external-ids"]["external-id"][0][
                              "external-id-url"
                            ].value.toString()
                          );
                          if (href) {
                            return (
                              <a
                                className="text-secondary"
                                target="_blank"
                                href={href}
                              >
                                {href && "Visit related project page"}
                              </a>
                            );
                          } else {
                            return null;
                          }
                        }}
                      </Container>
                    );
                  }
                }
              </OrcidTimeline>
            </Container>
          </Col>
          <Col></Col>
        </Row>
        <br></br>
        <br></br>
        <br></br>
          </Tab>
          <Tab eventKey="profile" title="Developer Style">
            <p>Test</p>
          </Tab>
          <Tab eventKey="contact" title="Conventional Style">
            <p>Test</p>
          </Tab>
        </Tabs>

        
      </BaseLayout>
    </>
  );
};

export default IndexPage;
