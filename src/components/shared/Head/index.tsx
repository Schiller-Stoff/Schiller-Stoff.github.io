import React from "react";
import { Helmet } from "react-helmet";
import packageJson from "../../../../package.json";


interface Props {
  keywords?: string[]
}

/**
 * Gatsby SEO component
 * https://www.gatsbyjs.com/docs/add-seo-component/
 * @returns 
 */
const Head: React.FC<Props> = (props) => {

  const baseUrl = process.env.BASE_URL;
  if(!baseUrl)throw new ReferenceError("You need to specify BASE_URL as .env variable. Specify the base address of your website e.g. https://my-site.com/")

  return (
    <Helmet>
      <html lang="en-us" prefix="og: https://ogp.me/ns# dc: http://purl.org/dc/terms"></html>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta name="copyright" content={packageJson.author} />
      <meta name="robots" content="index, follow"/>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
      <meta charSet="utf-8" />
      <meta property="og:description" name="description" content={packageJson.description} />
      <meta property="og:locale" content="en-us" />
      <meta property="og:author" name="author" content={packageJson.author} />
      <meta property="dc:creator" name="author" content={packageJson.author} />
      <meta property="og:url" content={baseUrl}/>
      <meta property="og:type" content="website" />
      <meta property="dc:type" content="website" />

      <meta name="apple-mobile-web-app-title" content={packageJson.description}/>

      {props.keywords && <meta name="keywords" content={props.keywords.toString().replace("[", "").replace("]", "").replace(/,/g, ", ")}></meta>}

      {
        // twitter tags
      }
      <meta name="twitter:title" content={packageJson.description} />
      <meta name="twitter:description" content={packageJson.description} />




      <base href={baseUrl} />

      <title property="og:title" lang="en-us">{packageJson.description}</title>
      <meta property="dc:title" lang="en-us" content={packageJson.description}/>
      <meta property="dc:description" lang="en-us" content={packageJson.description}/>

      <link rel="canonical" href={baseUrl} />

      <link rel="apple-touch-icon" href="/icons/icons8-apple-96.png"></link>


      {
        // maybe later add apple touch icon

        /* <link rel="apple-touch-icon" href="http://mysite.com/img/apple-touch-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="http://mysite.com/img/apple-touch-icon-72x72.png" /> */}


    </Helmet>
  )

}


export default Head;