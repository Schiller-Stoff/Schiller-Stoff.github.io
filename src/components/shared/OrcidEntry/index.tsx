
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
    <>
      <Row>
        <Col md={12} xl={7}>
          <h1 className="pt-md-2 m-0 text-decoration-underline" id="start">
            <strong>
              {orcidRoot.person.name["given-names"].value}{" "}
              {orcidRoot.person.name["family-name"].value}
            </strong>
          </h1>
          <h2 className="text-secondary h5">
            {
              orcidRoot["activities-summary"].employments["employment-summary"][0][
              "role-title"
              ]
            }{" "}
            at{" "}
            {
              orcidRoot["activities-summary"].employments["employment-summary"][0]
                .organization.name
            }
          </h2>
          <OrcidBiography orcidRoot={orcidRoot}></OrcidBiography>
          <Link className="btn btn-warning" to="/#works">View portfolio</Link>
          {" "}
          <Link className="btn btn-secondary" to="/#employments">View resume</Link>
        </Col>
        <Col>
          <div className="mt-md-4 m-0 border border-2">
            
                <img
                  alt="Main profile picture"
                  src={
                    process.env.LINK_TO_PROFILE_IMG
                      ? process.env.LINK_TO_PROFILE_IMG
                      : "/img/sebi_snow_quer.PNG"
                  }
                  width={410}
                  height={300}
                ></img>
                
              
          </div>
        </Col>
      </Row>

    </>
  );
};

export default OrcidEntry;
