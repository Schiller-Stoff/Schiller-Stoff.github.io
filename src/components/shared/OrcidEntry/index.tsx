import { faAlignJustify, faTh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "gatsby";
import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";
import { Orcid } from "../../../types/orcid";
import OrcidBiography from "../OrcidBiography";
import Typed from "react-typed";

interface Props {
  orcidRoot: Orcid.RootObject;
}

/**
 * Renders entry for personal website based on given ORCID root object data.
 */
const OrcidEntry: React.FC<Props> = ({ orcidRoot }) => {
  return (
    <section>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Row>
        <Col md={12} xl={10}>
          <p style={{marginBottom: "-.75em", fontSize:".75em"}}>DEV</p>
          <p style={{marginBottom: "-.75em", fontSize:".75em"}}>RESEARCH</p>
          <p style={{marginBottom: "-.75em", fontSize:".75em"}}>SOFTWARE SOLUTIONS</p>
          <h1 className="m-0" id="start" style={{ fontSize: "4em" }}>
            {orcidRoot.person.name["given-names"].value}{" "}
            {orcidRoot.person.name["family-name"].value}
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
            typeSpeed={10}
            backSpeed={20}
            backDelay={1000}
            style={{ fontSize: "1.5em"}}
            showCursor={true}
            className="self-typed"
            cursorChar="|"
          />
          {/* <h2
            className="text-dark h5 mb-4"
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
          </h2> */}
          {/* <hr></hr> */}
          {/* <OrcidBiography orcidRoot={orcidRoot}></OrcidBiography> */}
          {/* <Link className="btn btn-light" to="/portfolio">
            <FontAwesomeIcon icon={faTh} size="1x" /> View portfolio
          </Link>{" "}
          <Link className="btn btn-light" to="/#employments">
            <FontAwesomeIcon icon={faAlignJustify} size="1x" /> View resume
          </Link> */}
        </Col>
        <Col>
          <div className="mt-md-4 m-0">
            {/* <img
              alt="Main profile picture"
              src={
                process.env.LINK_TO_PROFILE_IMG
                  ? process.env.LINK_TO_PROFILE_IMG
                  : "/img/profile.jpg"
              }
              width={150}
              height={150}
              style={{
                // borderRadius: "100%",
                margin: "1em 0",
                filter: "grayscale(150%)",
              }}
            ></img> */}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default OrcidEntry;
