import React from "react";
import BaseLayout from "../../components/shared/layouts/BaseLayout";
import OrcidHead from "../../components/shared/OrcidHead";
import OrcidNav from "../../components/shared/OrcidNav";
import { Orcid } from "../../types/orcid";
import { Link } from "gatsby";
import { Card, Col, Row } from "react-bootstrap";

const StoriesPage: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> =
  (props) => {
    return (
      <BaseLayout
        orcidRoot={props.pageContext.persOrcid}
        headComponent={<OrcidHead orcidRoot={props.pageContext.persOrcid} />}
        nav={<OrcidNav orcidRoot={props.pageContext.persOrcid} />}
      >
        <h1>Stories</h1>
        <h2 className="h5 mb-4" style={{ fontWeight: 300, fontSize: "1.35em" }}>
          Visual story ("scrolly-")telling about the projects I've finished. For on overview about all my works visit the <Link to="/portfolio">Portfolio</Link> page.    
        </h2>
        <hr />

        <Row xs={1} md={2} lg={3} className="g-4">
          <Col>
            <Link className="text-decoration-none" to="/stories/derla">
              <Card>
                <Card.Body>
                  <Card.Title as="h3" className="h6">
                    DERLA - A research project at the University of Graz  
                  </Card.Title>
                  <Card.Text style={{fontSize:".85em"}}>
                  together with ZIM Graz, CJS - Center for Jewish Studies, _erinnern.at_
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>
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
      </BaseLayout>
    );
  };

export default StoriesPage;
