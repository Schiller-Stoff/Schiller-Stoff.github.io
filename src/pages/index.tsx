
import React from "react";
import BaseLayout from "../components/shared/layouts/BaseLayout";
import StyleOverlay from "../components/static/EntryHero";

const IndexPage: React.FC = () => {
  return (
    <>
    <StyleOverlay></StyleOverlay>
    <BaseLayout>
      <p>Hi there!</p>
    </BaseLayout>
    </>
  )
}

export default IndexPage
