import { faBook, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Row, Col } from "react-bootstrap";
import { Orcid } from "../../../types/orcid";

interface Props {
  orcidRoot: Orcid.RootObject;
}

const OrcidProfileCard: React.FC<Props> = ({orcidRoot}) => {
  return (
    <Row>
      <Col md={6}>
        <Row className="shadow p-3">
          <Col md={5}>
            {/* <Button variant="secondary">Request meeting</Button> */}
            <img
              alt="Main profile picture"
              src={
                process.env.LINK_TO_PROFILE_IMG
                  ? process.env.LINK_TO_PROFILE_IMG
                  : "/img/profile.jpg"
              }
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
                  This page is based on data provided by the ORCID public API
                  and rendered by Gatsby.js based on React.
                </small>
              </li>
              <li>
                <small>
                  The CV template page is maintained by the DH-Frontend Group in
                  Graz Austria.
                </small>
              </li>
              <li>
                <small>
                  <a
                    target="_blank"
                    href={orcidRoot["orcid-identifier"].uri}
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
      <Col md={5} xl={2}>
        {orcidRoot.person.keywords.keyword[0] && <><h3 className="h5 mt-md-3">My background</h3>
        <ul style={{ listStyle: "none", marginLeft: "-1em" }}>
          {orcidRoot.person.keywords.keyword.slice(0,5).map((kword, index) => (
            <li key={`kword_${index}`}>
              <small>
                <FontAwesomeIcon
                  className="text-dark"
                  icon={faBook}
                ></FontAwesomeIcon>
                {" " + kword.content}
              </small>
            </li>
          ))}
        </ul></>}
      </Col>
      <Col className="d-none d-xl-block">
      {orcidRoot.person["researcher-urls"]["researcher-url"][0] && <><h3 className="h5 mt-md-3">My links</h3>
        <ul style={{ listStyle: "none", marginLeft: "-1em" }}>
          {orcidRoot.person["researcher-urls"][
            "researcher-url"
          ].slice(0,5).map((rurl, index) => (
            <li key={`url_${index}`}>
              <small>
                <FontAwesomeIcon
                  className="text-dark"
                  icon={faLink}
                ></FontAwesomeIcon>
                <a
                  target="_blank"
                  className="text-dark"
                  href={rurl.url.value.toString()}
                >
                  {" " + (rurl["url-name"] ? rurl["url-name"] : "Link")}
                </a>
              </small>
            </li>
          ))}
        </ul></>}
      </Col>
    </Row>
  );
};

export default OrcidProfileCard;
