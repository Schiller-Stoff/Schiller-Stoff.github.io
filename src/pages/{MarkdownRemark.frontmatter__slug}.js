import React from "react";
import { graphql } from "gatsby";
import BaseLayout from "../components/shared/layouts/BaseLayout";
import { Col, Row } from "react-bootstrap";

export default function Template({
  pageContext,
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;
  return (
    <BaseLayout orcidRoot={pageContext.persOrcid}>
      <div className="blog-post-container" style={{ minHeight: "75vh" }}>
        <div className="blog-post">
          <p>
            <strong>{frontmatter.title}</strong> | {frontmatter.date}
          </p>
          <hr />
          <br />
          <Row>
            <Col lg={8}>
              <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </BaseLayout>
  );
}

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`;
