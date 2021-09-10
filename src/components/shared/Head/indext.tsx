import React from "react";
import { Helmet } from "react-helmet";
import packageJson from "../../../../package.json";

const Head: React.FC = () => {

  

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="description" content={packageJson.description}/>
      <meta name="author" content={packageJson.author}/>
      <base href="http://localhost:8080/"/>
      <title>{packageJson.name}</title>
      <link rel="canonical" href="http://localhost:8080/" />
    </Helmet>
  )

}


export default Head;