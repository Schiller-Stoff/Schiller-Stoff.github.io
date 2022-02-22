import React from "react";
import BaseLayout from "../../components/shared/layouts/BaseLayout";
import OrcidHead from "../../components/shared/OrcidHead";
import OrcidNav from "../../components/shared/OrcidNav";
import { Orcid } from "../../types/orcid";

/**
 * React scrollama needs to be lazy loaded. https://www.gatsbyjs.com/docs/using-client-side-only-packages/#workaround-3-load-client-side-dependent-components-with-loadable-components
 * Because of client only calculations that breaks SSR.
 */
const ClientSideOnlyLazy = React.lazy(
  () => import("../../components/static/stories/DerlaStory")
);

const StoriesPage: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> =
  (props) => {
    const isSSR = typeof window === "undefined";

    return (
      <BaseLayout
        orcidRoot={props.pageContext.persOrcid}
        headComponent={<OrcidHead orcidRoot={props.pageContext.persOrcid} />}
        nav={<OrcidNav orcidRoot={props.pageContext.persOrcid} />}
      >
        <h1>Data stories demo page</h1>
        {!isSSR && (
          <React.Suspense fallback={<div />}>
            <ClientSideOnlyLazy />
          </React.Suspense>
        )}
      </BaseLayout>
    );
  };

export default StoriesPage;
