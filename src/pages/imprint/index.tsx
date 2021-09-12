import React from "react";
import BaseLayout from "../../components/shared/layouts/BaseLayout";

/**
 * Imprint page component
 * @returns 
 */
const Imprint: React.FC = () => {
  return (
    <BaseLayout>
      <br/>
      <br/>
      <h1>Imprint</h1>
      <br/>
      <h2 className="h3">Acknowledgments</h2>
      <h3 className="h4">Apple Touch icons</h3>
      <p>by "Apple icon by <a href="https://icons8.com/" target="_blank">Icons8</a>"</p>
      <h3>Themes and icons</h3>
      <p><a href="https://gatsby-theme-portfolio.netlify.app/" target="_blank">Smakosh gatsby theme</a></p>
      <p><a href="https://fontawesome.com/" target="_blank">Fontawesome</a></p>
    </BaseLayout>
  );
};

export default Imprint;
