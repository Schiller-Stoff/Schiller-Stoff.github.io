import React from "react";
import { Row, Col, Accordion, Button } from "react-bootstrap";
import { Orcid } from "../../../types/orcid";

interface Props {
  orcidRoot: Orcid.RootObject;
}

const OrcidProfileCard: React.FC<Props> = ({ orcidRoot }) => {
  return (
    <Row>
      <Col lg={6}>
        {/* <Button variant="secondary">Request meeting</Button> */}
        <div className="border border p-3">
          
              <h3 className="h5">Interests &amp; skills</h3>
              {orcidRoot.person.keywords.keyword
                      .map((kword, index) => (
                        <Button className="m-1" variant="outline-dark" key={`kword_${index}`}>{" " + kword.content}</Button>
                      ))}

        </div>
      </Col>
      <Col md={5} xl={6}>
        <br className="d-lg-none"/>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>My primary background</Accordion.Header>
            <Accordion.Body>
              {orcidRoot.person.keywords.keyword[0] && (
                <>
                  <ul>
                    {orcidRoot.person.keywords.keyword
                      .slice(0, 5)
                      .map((kword, index) => (
                        <li key={`kword_${index}`}>
                          <small>{" " + kword.content}</small>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>My Links</Accordion.Header>
            <Accordion.Body>
            {orcidRoot.person["researcher-urls"]["researcher-url"][0] && (
          <>
            <ul>
              {orcidRoot.person["researcher-urls"]["researcher-url"]
                .map((rurl, index) => (
                  <li key={`url_${index}`}>
                    <small>
                      <a
                        rel="noopener"
                        target="_blank"
                        className="text-dark"
                        href={rurl.url.value.toString()}
                      >
                        {rurl["url-name"] ? rurl["url-name"] : "Link"}
                      </a>
                    </small>
                  </li>
                ))}
            </ul>
          </>
        )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

      </Col>
    </Row>
  );
};

export default OrcidProfileCard;
