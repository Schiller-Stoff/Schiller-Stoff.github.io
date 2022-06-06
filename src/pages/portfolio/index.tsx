import React from "react";
import { Row, Col, Card, Badge, Nav } from "react-bootstrap";
import BaseLayout from "../../components/shared/layouts/BaseLayout";
import OrcidHead from "../../components/shared/OrcidHead";
import OrcidNav from "../../components/shared/OrcidNav";
import { Orcid } from "../../types/orcid";
import MyStringUtils from "../../utils/MyStringUtils";

const Portfolio: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> = (
  props
) => {

  const [filterValue, setFilterValue] = React.useState<string>("");

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

  const trimTitle = (title: string) => (title.length >= 70) ? title.slice(0,70) + " ..." : title;

  /**
   * Used as filter function. Handles filtering of orcid works according to it's work types.
   * @param work Orcid work
   * @param index index of iteration from calling filter function
   * @returns boolean for filtering
   */
  const handleFilter = (work: Orcid.WorkSummary, index: number) => {
    if(!filterValue)return true;

    if((filterValue === "WEBSITE")){
      return (work.type === "WEBSITE") || (work.type === "ONLINE_RESOURCE")
    }

    if((filterValue === "JOURNAL_ARTICLE")){
      return (work.type.includes("CONFERENCE")) || (work.type === "JOURNAL_ARTICLE") || (work.type === "DISSERTATION")
    }

    return work.type === filterValue;

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
          className="h5 mb-4"
          style={{ fontWeight: 300, fontSize: "1.35em" }}
        >
          Completed research, software projects and publications 
        </h2>


        <ul className="m-0 p-0 portfolio_nav">
          <li className={`d-inline ${ filterValue === "" ? "text-decoration-underline" : ''}`} onClick={() => setFilterValue("")}>All</li>
          <li className={`d-inline ms-2 ${ filterValue === "RESEARCH_TOOL" ? "text-decoration-underline" : ''}`} onClick={() => setFilterValue("RESEARCH_TOOL")}>Research-software</li>
          <li className={`d-inline ms-2 ${ filterValue === "WEBSITE" ? "text-decoration-underline" : ''}`} onClick={() => setFilterValue("WEBSITE")}>Web-projects</li>
          <li className={`d-inline ms-2 ${ filterValue === "JOURNAL_ARTICLE" ? "text-decoration-underline" : ''}`} onClick={() => setFilterValue("JOURNAL_ARTICLE")}>Publications</li>
        </ul>

        <br />

        <Row xs={1} md={2} lg={3} className="g-4">
          {props.pageContext.persOrcid["activities-summary"].works.group
            .reduce((aggr, grp) => {
              aggr.push(grp["work-summary"][0]);
              return aggr;
              // then map reduced data to timeline items
            }, []).filter(handleFilter).map((work: Orcid.WorkSummary, index: number) => {
              return (
                <Col key={index}>
                  <Card className="text-decoration-none" target="_blank" rel="no-referrer" as="a" href={MyStringUtils.catchToString(() => work["external-ids"]["external-id"][0]["external-id-url"].value.toString())}>
                    {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                    <Card.Body>
                      <Card.Title as="h3" className="h6">
                        { trimTitle(work.title.title.value.toString())}
                      </Card.Title>
                      <Card.Text>
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
