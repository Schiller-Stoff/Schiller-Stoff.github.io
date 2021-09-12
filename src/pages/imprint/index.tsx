import React from "react";
import BaseLayout from "../../components/shared/layouts/BaseLayout";

/**
 * Imprint page component
 * @returns 
 */
const Imprint: React.FC = () => {
  return (
    <BaseLayout>
      <h1>Imprint</h1>
      <h2>Acknoledgments</h2>
      <h3>Apple Touch icons</h3>
      <p>by "Apple icon by <a href="https://icons8.com/" target="_blank">Icons8</a>"</p>
    </BaseLayout>
  );
};

export default Imprint;
