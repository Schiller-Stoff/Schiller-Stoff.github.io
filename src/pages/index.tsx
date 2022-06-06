import { Link } from "gatsby";
import React from "react";
import { Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import ContentHeading from "../components/shared/ContentHeading";
import EntryPaths from "../components/shared/EntryPaths";
import BaseLayout from "../components/shared/layouts/BaseLayout";
import OrcidBiography from "../components/shared/OrcidBiography";
import OrcidEntry from "../components/shared/OrcidEntry";
import OrcidHead from "../components/shared/OrcidHead";
import OrcidIconBar from "../components/shared/OrcidIconBar";
import OrcidNav from "../components/shared/OrcidNav";
import OrcidProfileCard from "../components/shared/OrcidProfileCard";
import OrcidSideNav from "../components/shared/OrcidSideNav";
import OrcidTimeline from "../components/shared/OrcidTimeline";
import OrcidWorkCard from "../components/shared/OrcidTimeline/OrcidWorkCard";
import { Orcid } from "../types/orcid";

const IndexPage: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> = (
  props
) => {
  return (
    <>
      <BaseLayout
        orcidRoot={props.pageContext.persOrcid}
        headComponent={<OrcidHead orcidRoot={props.pageContext.persOrcid} />}
        nav={<OrcidNav orcidRoot={props.pageContext.persOrcid} />}
      >   
            <OrcidIconBar
              orcidURL={props.pageContext.persOrcid["orcid-identifier"].uri}
              researchURLs={props.pageContext.persOrcid.person["researcher-urls"]["researcher-url"]}
              mail={
                props.pageContext.persOrcid.person.emails.email[0] &&
                props.pageContext.persOrcid.person.emails.email[0].email
              }
            ></OrcidIconBar>
            <br></br>
            <OrcidEntry orcidRoot={props.pageContext.persOrcid}></OrcidEntry>
            
            <EntryPaths></EntryPaths>

            <br />
            <br />
            <OrcidProfileCard orcidRoot={props.pageContext.persOrcid} />
            <br></br>
            <br></br>
            <br></br>

            <ContentHeading>Current and past employments</ContentHeading>
            <p>Defined by the ORCID ontology: Employment is a formal employment relationship with an organization, e.g. staff, intern, researcher, contractor. Employment can be paid or unpaid.</p>
            <OrcidTimeline
              orcidSequence={props.pageContext.persOrcid["activities-summary"].employments}
              mode="VERTICAL_ALTERNATING"
            ></OrcidTimeline>
            <br></br>
            <br></br>
            <ContentHeading>Educational background</ContentHeading>
            <p>Education is participation in an academic higher education program to receive an undergraduate, graduate, or other degree. Qualification is participation in a professional or vocational accreditation, certification, or training program. Both may be in progress or unfinished.</p>
            <OrcidTimeline
              orcidSequence={props.pageContext.persOrcid["activities-summary"].educations}
              mode="VERTICAL_ALTERNATING"
            ></OrcidTimeline>
            <br></br>
            <br></br>
            <ContentHeading>Works: Things I have accomplished</ContentHeading>
            <p>ORCID defines works as your research outputs, including publications, data sets, conference presentations, and more.</p>
            <OrcidTimeline
              orcidSequence={props.pageContext.persOrcid["activities-summary"].works}
              mode="VERTICAL_ALTERNATING"
            ></OrcidTimeline>

      </BaseLayout>
    </>
  );
};

export default IndexPage;
