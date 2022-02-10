import { faAlignJustify, faTh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "gatsby";
import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";
import { Orcid } from "../../../types/orcid";
import OrcidBiography from "../OrcidBiography";

interface Props {
  orcidRoot: Orcid.RootObject;
}

/**
 * Renders entry for personal website based on given ORCID root object data.
 */
const OrcidEntry: React.FC<Props> = ({ orcidRoot }) => {
  return (
    <section>
      <Row>
        <Col md={12} xl={10}>
          <h1 className="pt-md-2 m-0" id="start" style={{ fontSize: "3em" }}>
            <strong>
              {orcidRoot.person.name["given-names"].value}{" "}
              {orcidRoot.person.name["family-name"].value}
            </strong>
          </h1>
          <h2
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
          </h2>
          {/* <hr></hr> */}
          <OrcidBiography orcidRoot={orcidRoot}></OrcidBiography>
          <Link className="btn btn-light" to="/portfolio">
            <FontAwesomeIcon icon={faTh} size="1x" /> View portfolio
          </Link>{" "}
          <Link className="btn btn-light" to="/#employments">
            <FontAwesomeIcon icon={faAlignJustify} size="1x" /> View resume
          </Link>
        </Col>
        <Col>
          <div className="mt-md-4 m-0">
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
            {/* <img
                  alt="Main profile picture"
                  style={{filter:"grayscale(100%) brightness(150%)", border:"5px solid grey"}}
                  src={
                    process.env.LINK_TO_PROFILE_IMG
                      ? process.env.LINK_TO_PROFILE_IMG
                      : "/img/sebi_snow_quer.PNG"
                  }
                  width={410}
                  height={300}
                ></img> */}
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default OrcidEntry;
