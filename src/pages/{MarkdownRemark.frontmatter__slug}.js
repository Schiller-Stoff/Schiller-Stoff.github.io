import React from "react";
import { graphql } from "gatsby";
import BaseLayout from "../components/shared/layouts/BaseLayout";
import { Col, Row } from "react-bootstrap";

export default function Template({
  pageContext,
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html, headings } = markdownRemark;
  return (
    <BaseLayout orcidRoot={pageContext.persOrcid}>
      <div className="blog-post-container" style={{ minHeight: "75vh" }}>
        <div className="blog-post">
          <p>
            <strong>{frontmatter.title}</strong> | {frontmatter.date}
          </p>
          <hr />
          <p><i>Summary:</i> {frontmatter.short}</p>
          <br />
          <Row>
            <Col lg={10}>
              <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </Col>
            <Col lg={2}>
              <ol style={{fontSize:".85em"}} className="sticky-top pt-lg-5 text-secondary list-style-none">
                {headings.map(hObj => <li><small><a className="text-decoration-none">{hObj.value}</a></small></li>)}
              </ol>  
            </Col>
          </Row>
        </div>
      </div>
      <br></br>
      <br></br>
    </BaseLayout>
  );
}

export const pageQuery = graphql`
  query ($id: String!) {
  markdownRemark(id: {eq: $id}) {
    html
    frontmatter {
      date(formatString: "MMMM DD, YYYY")
      slug
      title
      short
    }
    headings {
      value
    }
  }
}

`;
