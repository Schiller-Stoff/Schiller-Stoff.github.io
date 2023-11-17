

# Personal Website / Linked Data CV
- of Sebastian David Stoff


## Description
- personal website based on data provided by ORCID.
- SSR of content via Gatsby sourcing from ORCID, package.json and env variables
- SEO emphasis: providing structured data in terms of RDFa to the page based on APIs calls in rendering process (e.g. ORCID)


## Used technologies and acknowledgments
- Gatsby.js, React.js, Typescript, React-Bootstrap 5, etc.
- Apple Touch icons by icons8 https://icons8.com/
- Smakosh Gatsby theme (https://gatsby-theme-portfolio.netlify.app/)
- fontawesome for icons (https://fontawesome.com/)


## Setup react-scroll-lama

Needs to be done because default intersection observer has a problem with the root margin calculation.

1. Go to index.es.js
2. search for "rootMargin"
3. set hardcoded value -> "0px 0px 0px 0px"


! You need to load react-scrollama via React-Suspense!
* React scrollama needs to be lazy loaded. https://www.gatsbyjs.com/docs/using-client-side-only-packages/#workaround-3-load-client-side-dependent-components-with-loadable-components
 * Because of client only calculations that breaks SSR.