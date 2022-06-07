import React from "react";
import BaseLayout from "../../components/shared/layouts/BaseLayout";
import OrcidSideNav from "../../components/shared/OrcidSideNav";
import { Orcid } from "../../types/orcid";

/**
 * Imprint page component
 * @returns
 */
const Imprint: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> = (
  props
) => {
  return (
    <BaseLayout orcidRoot={props.pageContext.persOrcid}>
      <h1 className="pt-md-2 m-0" id="start"><strong>Imprint and Data protection</strong></h1>
      <h2 className="text-secondary h5">Publisher, development and implementation</h2>
      <br />
      <h3 className="h4">Publisher, development and implementation</h3>
      <p>
        Personal project. (Legal responsibilities according to CV information on
        main page)
      </p>
      <h3 className="h4">The following technologies form an integral part of the website</h3>
      <p>Gatsby.js, React.js and Typescript </p>
      <h3 className="h4">Information according to § 5 E-Commerce Law</h3>
      <p>
        All content and services on this website are provided by the owner of
        the website stated on home-page
      </p>
      <br />
      <h2>Acknowledgments</h2>
      <h3 className="h4">Apple Touch icons</h3>
      <p>
        by "Apple icon by{" "}
        <a href="https://icons8.com/" target="_blank">
          Icons8
        </a>
        "
      </p>
      <h3 className="h4">Themes and icons</h3>
      <p>
        <a href="https://themes.3rdwavemedia.com/devcard/bs5/portfolio.html" target="_blank">Bootstrap Dev Card theme</a>
      </p>
      <p>
        <a href="https://brittanychiang.com/#projects" target="_blank">
        Brittany Chiang gatsby theme
        </a>
      </p>
      <p>
        <a href="https://fontawesome.com/" target="_blank">
          Fontawesome
        </a>
      </p>
    </BaseLayout>
  );
};

export default Imprint;
