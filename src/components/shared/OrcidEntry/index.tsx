import { faAlignJustify, faTh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "gatsby";
import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";
import { Orcid } from "../../../types/orcid";
import OrcidBiography from "../OrcidBiography";
import Typed from "react-typed";
import ContentHeading from "../ContentHeading";

interface Props {
  orcidRoot: Orcid.RootObject;
}

/**
 * Renders entry for personal website based on given ORCID root object data.
 */
const OrcidEntry: React.FC<Props> = ({ orcidRoot }) => {
  return (
    <section>
      <Row className="mt-2">
        <Col md={12} xl={10}>
          <p style={{marginBottom: "-.75em", fontSize:".75em"}}>DEV</p>
          <p style={{marginBottom: "-.75em", fontSize:".75em"}}>RESEARCH</p>
          <p style={{marginBottom: "-.75em", fontSize:".75em"}}>SOFTWARE SOLUTIONS</p>
          <h1 className="p-0" id="start" style={{ fontSize: "5em", marginTop:"-.4em", marginBottom:"-.4em", color:"#ccd6f6" }}><strong>
            {orcidRoot.person.name["given-names"].value}{" "}
            {orcidRoot.person.name["family-name"].value}.</strong>
          </h1>

          <span style={{fontSize:"1.5em"}}>... </span> <Typed
            loop
            strings={[
              "does #DigitalHumanities",
              "loves #SoftwareDevelopment ",
              "cares about #SoftwareArchitecture",
              "worries about #SoftwareQuality"
              //"writes his dissertation about the role #SoftwareArchitecture and #SoftwareDesign have to play in the field of #DigitalHumanities to ensure #SoftwareQuality in scientific research."
            ]}
            typeSpeed={20}
            backSpeed={30}
            backDelay={1000}
            style={{ fontSize: "1.5em"}}
            showCursor={true}
            className="self-typed"
            cursorChar="|"
          />
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <ContentHeading>Whoami?</ContentHeading>
          <h3
            className="h5"
            style={{ fontWeight: 300, fontSize: "1.35em" }}
          >
            {
              orcidRoot["activities-summary"].employments[
                "employment-summary"
              ][0]["role-title"]
            }{" "}
            at{" "}
            {
              orcidRoot["activities-summary"].employments[
                "employment-summary"
              ][0].organization.name
            }
          </h3>
          <img
              alt="Main profile picture"
              src={
                process.env.LINK_TO_PROFILE_IMG
                  ? process.env.LINK_TO_PROFILE_IMG
                  : "/img/profile.jpg"
              }
              width={150}
              height={150}
              style={{
                borderRadius: "100%",
                margin: "1em 0",
                filter: "grayscale(150%)",
              }}
            ></img>
          <br></br>
          <br></br>
          <ContentHeading>About me</ContentHeading>
          <br></br>
          <OrcidBiography orcidRoot={orcidRoot}></OrcidBiography>
          <br></br>
        </Col>
      </Row>
    </section>
  );
};

export default OrcidEntry;
