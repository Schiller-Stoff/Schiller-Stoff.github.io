import React from "react";
import BaseLayout from "../../components/shared/layouts/BaseLayout";
import { Orcid } from "../../types/orcid";
import { graphql, Link, useStaticQuery } from "gatsby";
import { Badge, Card, Col, Row } from "react-bootstrap";

const Blog: React.FC<{ pageContext: { persOrcid: Orcid.RootObject }}> = (props) => {

  const data: QueryResult.Data = useStaticQuery(query);

  return <BaseLayout
    orcidRoot={props.pageContext.persOrcid}
  >
    <h1>Blog</h1>
    <h2
          className="h5 mb-4"
          style={{ fontWeight: 300, fontSize: "1.35em" }}
        >
          Overview of posts
        </h2>
    <hr/>

    <Row xs={1} md={2} lg={2} className="g-4">
          {data.allMarkdownRemark.edges.map((edge, index) => {
              if(edge.node.frontmatter.draft)return null;
              return (
                <Col key={index}>
                  <Link className="text-decoration-none" to={edge.node.frontmatter.slug} rel="no-referrer">
                  <Card className="text-dark border-2">
                    {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                    <Card.Body>
                      <Card.Title as="h3" className="h6">
                        {edge.node.frontmatter.title}
                      </Card.Title>
                      <Card.Text>
                        <small>{edge.node.frontmatter.short}</small>
                        <br/>
                        <i>Excerpt: </i><small>{edge.node.excerpt}</small>
                        <br />
                        <br />
                        <Badge bg={edge.node.frontmatter.language === "english" ? "success" : "dark"} ><small>{edge.node.frontmatter.language}</small></Badge>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  </Link>
                </Col>
              );
            })}
        </Row>

    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </BaseLayout>

}

const query = graphql`
  query FileQuery {
    allMarkdownRemark {
      edges {
        node {
          id
          frontmatter {
            date(fromNow: true)
            title
            slug
            draft
            language
            short
          }
          excerpt
        }
      }
    }
  }
`

declare module QueryResult {

  export interface Frontmatter {
      date: string;
      title: string;
      slug: string;
      draft: boolean;
      short: string;
      language: string;
  }

  export interface Node {
      id: string;
      frontmatter: Frontmatter;
      excerpt: string;
  }

  export interface Edge {
      node: Node;
  }

  export interface AllMarkdownRemark {
      edges: Edge[];
  }

  export interface Data {
      allMarkdownRemark: AllMarkdownRemark;
  }

  export interface Extensions {
  }

  export interface RootObject {
      data: Data;
      extensions: Extensions;
  }

}




export default Blog;