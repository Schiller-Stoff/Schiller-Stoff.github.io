import React from "react";
import BaseLayout from "../../../components/shared/layouts/BaseLayout";
import OrcidHead from "../../../components/shared/OrcidHead";
import OrcidNav from "../../../components/shared/OrcidNav";
import { Orcid } from "../../../types/orcid";
import ContentHeading from "../../../components/shared/ContentHeading";

/**
 * React scrollama needs to be lazy loaded. https://www.gatsbyjs.com/docs/using-client-side-only-packages/#workaround-3-load-client-side-dependent-components-with-loadable-components
 * Because of client only calculations that breaks SSR.
 */
const ClientSideOnlyLazy = React.lazy(
  () => import("../../../components/static/stories/DerlaStory")
);

const DerlaStoriesPage: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> =
  (props) => {
    const isSSR = typeof window === "undefined";

    return (
      <BaseLayout
        orcidRoot={props.pageContext.persOrcid}
        headComponent={<OrcidHead orcidRoot={props.pageContext.persOrcid} />}
        nav={<OrcidNav orcidRoot={props.pageContext.persOrcid} />}
      >
        <h1>Derla</h1>
        <h2
          className="h5 mb-4"
          style={{ fontWeight: 300, fontSize: "1.35em" }}
        >
          A research project at the University of Graz (together with ZIM Graz, CJS - Center for Jewish Studies, _erinnern.at__ Vorarblerg)
        </h2>
        <hr/>
        <p className="w-75 mb-0">The <a href="https://gams.uni-graz.at/context:derla" target="blank">Digital Landscape of Remembrance Austria (DERLA)</a> is a scientific documentation and mediation project. It documents Austrian <strong>places and signs</strong> of remembrance for the victims as well as the places of terror of National Socialism.</p>
        <br></br>
        <ContentHeading>Places of remembrance</ContentHeading>
        <p className="w-75">"Places of remembrance," memorials and monuments are visible signs of historical awareness in everyday life</p>
        {!isSSR && (
          <React.Suspense fallback={<div />}>
            <ClientSideOnlyLazy />
          </React.Suspense>
        )}
      </BaseLayout>
    );
  };

export default DerlaStoriesPage;
