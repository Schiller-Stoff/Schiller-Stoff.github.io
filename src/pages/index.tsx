import { Link } from "gatsby";
import React from "react";
import { Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
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


      </BaseLayout>
    </>
  );
};

export default IndexPage;
