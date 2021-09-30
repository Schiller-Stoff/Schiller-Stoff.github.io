import React from "react";
import BaseLayout from "../../components/shared/layouts/BaseLayout";
import { Orcid } from "../../types/orcid";
import { graphql, Link, useStaticQuery } from "gatsby";

const Blog: React.FC<{ pageContext: { persOrcid: Orcid.RootObject }}> = (props) => {

  const data: QueryResult.Data = useStaticQuery(query);

  return <BaseLayout
    orcidRoot={props.pageContext.persOrcid}
  >
    <h1>Blog</h1>
    <h2
          className="text-dark h5 mb-4"
          style={{ fontWeight: 300, fontSize: "1.35em" }}
        >
          Overview of posts
        </h2>
    <hr/>
    <ul>
      {data.allMarkdownRemark.edges.map(edge => <li><Link to={edge.node.frontmatter.slug}>{edge.node.frontmatter.title}</Link></li>)}

    </ul>
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