---
slug: "/blog/react-scrollama"
date: "2022-02-22"
title: "How to setup react-scrollama with gatsby"
---

# Used versions and dependencies


# 

- react-scrollama
- should be easy


## Setup react-scroll-lama

- NO OTHER WAY (as of now)

Needs to be done because default intersection observer has a problem with the root margin calculation.

1. Go to index.es.js
2. search for "rootMargin"
3. set hardcoded value -> "0px 0px 0px 0px"


! You need to load react-scrollama via React-Suspense!
* React scrollama needs to be lazy loaded. https://www.gatsbyjs.com/docs/using-client-side-only-packages/#workaround-3-load-client-side-dependent-components-with-loadable-components
 * Because of client only calculations that breaks SSR.

