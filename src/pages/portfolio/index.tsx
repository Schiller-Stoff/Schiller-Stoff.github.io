import React from "react";
import { Row, Col, Card, Badge } from "react-bootstrap";
import BaseLayout from "../../components/shared/layouts/BaseLayout";
import OrcidHead from "../../components/shared/OrcidHead";
import OrcidNav from "../../components/shared/OrcidNav";
import { Orcid } from "../../types/orcid";
import MyStringUtils from "../../utils/MyStringUtils";

const Portfolio: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> = (
  props
) => {
  return (
    <>
      <BaseLayout
        orcidRoot={props.pageContext.persOrcid}
        headComponent={
          <OrcidHead orcidRoot={props.pageContext.persOrcid}></OrcidHead>
        }
        nav={<OrcidNav orcidRoot={props.pageContext.persOrcid} />}
      >
        <h1>Portfolio</h1>

        <h2
          className="text-dark h5 mb-4"
          style={{ fontWeight: 300, fontSize: "1.35em" }}
        >
          Completed research and development projects 
        </h2>

        <Row xs={1} md={2} lg={3} className="g-4">
          {props.pageContext.persOrcid["activities-summary"].works.group
            .reduce((aggr, grp) => {
              aggr.push(grp["work-summary"][0]);
              return aggr;
              // then map reduced data to timeline items
            }, []).map((work: Orcid.WorkSummary) => {
              console.log(work)
              return (
                <Col>
                  <Card className="text-dark text-decoration-none border-2" target="_blank" rel="no-referrer" as="a" href={MyStringUtils.catchToString(() => work["external-ids"]["external-id"][0]["external-id-url"].value.toString())}>
                    {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                    <Card.Body>
                      <Card.Title>
                        {work.title.title.value.toString()}
                      </Card.Title>
                      <Card.Text>
                        {/* <small>{MyStringUtils.catchToString(() => work["external-ids"]["external-id"][0]["external-id-url"].value.toString())}</small> */}
                        <br />
                        <Badge><small>{work.type}</small></Badge>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}

          {/* <Col>
            <Card>
              <Card.Img variant="top" src="holder.js/100px160" />
              <Card.Body>
                <Card.Title>Cantus</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit longer.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>

        <h2
          className="text-dark h5 mb-4"
          style={{ fontWeight: 300, fontSize: "1.35em" }}
        >
          Additional
        </h2>
      </BaseLayout>
    </>
  );
};

export default Portfolio;
