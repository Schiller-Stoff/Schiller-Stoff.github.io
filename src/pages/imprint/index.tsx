import React from "react";
import BaseLayout from "../../components/shared/layouts/BaseLayout";
import { Orcid } from "../../types/orcid";

/**
 * Imprint page component
 * @returns 
 */
const Imprint: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> = (props) => {
  console.log(props.pageContext.persOrcid);
  return (
    <BaseLayout>
      <br/>
      <br/>
      <h1>Imprint and Data protection</h1>
      <br/>
      <h2>Publisher, development and implementation</h2>
      <p>Personal project. (Legal responsibilities according to CV information on main page)</p>
      <h3>The following technologies form an integral part of the website</h3>
      <p>Gatsby.js, React.js and Typescript </p>
      <h3>Information according to § 5 E-Commerce Law</h3>
      <p>All content and services on this website are provided by the owner of the website stated on home-page</p>
      <br/>
      <h2>Acknowledgments</h2>
      <br />
      <h3 className="h4">Apple Touch icons</h3>
      <p>by "Apple icon by <a href="https://icons8.com/" target="_blank">Icons8</a>"</p>
      <h3>Themes and icons</h3>
      <p><a href="https://gatsby-theme-portfolio.netlify.app/" target="_blank">Smakosh gatsby theme</a></p>
      <p><a href="https://fontawesome.com/" target="_blank">Fontawesome</a></p>
    </BaseLayout>
  );
};

export default Imprint;
