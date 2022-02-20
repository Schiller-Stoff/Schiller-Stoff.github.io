import React from "react";
import BaseLayout from "../../components/shared/layouts/BaseLayout";
import OrcidHead from "../../components/shared/OrcidHead";
import OrcidNav from "../../components/shared/OrcidNav";
import { Orcid } from "../../types/orcid";

const StoriesPage: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> =
  (props) => {
    return (
      <BaseLayout
        orcidRoot={props.pageContext.persOrcid}
        headComponent={<OrcidHead orcidRoot={props.pageContext.persOrcid} />}
        nav={<OrcidNav orcidRoot={props.pageContext.persOrcid} />}
      >
        <h1>Data stories demo page</h1>
      </BaseLayout>
    );
  };

export default StoriesPage;
