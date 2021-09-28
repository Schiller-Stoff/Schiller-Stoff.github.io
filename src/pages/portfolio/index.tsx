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

  /**
   * Returns specific colored badges according to given orcid work type. 
   * @param workType Type of the work as defined by orcid.
   * @returns bs badge element with assigned background value.
   */
  const renderBadge = (workType: Orcid.WorkType) => {
    let colorClassName = "";
    switch(workType){
      case "RESEARCH_TOOL":
        colorClassName = "primary";
        break;
      case "CONFERENCE_ABSTRACT":
        colorClassName = "warning";
        break;
      case "CONFERENCE_POSTER":
        colorClassName = "secondary";
        break;
      case "WEBSITE":
        colorClassName = "danger";
        break;
      case "ONLINE_RESOURCE":
        colorClassName = "danger";
        break;
      case "JOURNAL_ARTICLE":
        colorClassName = "success";
        break;
      case "DISSERTATION":
        colorClassName = "dark";
        (workType as string) = "MASTER_THESIS"
        break;
      default:
        colorClassName = "secondary";
        break;
    }
    return <Badge bg={colorClassName}><small>{workType}</small></Badge>
  }

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
          Completed research and software projects 
        </h2>

        <Row xs={1} md={2} lg={3} className="g-4">
          {props.pageContext.persOrcid["activities-summary"].works.group
            .reduce((aggr, grp) => {
              aggr.push(grp["work-summary"][0]);
              return aggr;
              // then map reduced data to timeline items
            }, []).map((work: Orcid.WorkSummary, index: number) => {
              return (
                <Col key={index}>
                  <Card className="text-dark text-decoration-none border-2" target="_blank" rel="no-referrer" as="a" href={MyStringUtils.catchToString(() => work["external-ids"]["external-id"][0]["external-id-url"].value.toString())}>
                    {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                    <Card.Body>
                      <Card.Title as="h3" className="h6">
                        {work.title.title.value.toString()}
                      </Card.Title>
                      <Card.Text>
                        {/* <small>{MyStringUtils.catchToString(() => work["external-ids"]["external-id"][0]["external-id-url"].value.toString())}</small> */}
                        <br />
                        {renderBadge(work.type)}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>

        {/* <h2
          className="text-dark h5 mb-4"
          style={{ fontWeight: 300, fontSize: "1.35em" }}
        >
          Additional
        </h2> */}

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </BaseLayout>
    </>
  );
};

export default Portfolio;
