import React from "react";
import { Orcid } from "../../../types/orcid";

interface Props {
  orcidURL: string;
  researchURLs: Orcid.ResearcherUrl[];
}

const OrcidIconBar: React.FC<Props> = (props) => {

  return (
    <div>
      <a href={props.orcidURL} target="_blank"><img width={48} height={40} src="https://theme.zdassets.com/theme_assets/2284388/5f241602bd45df20fe02a537477dc62c1e1ed582.png" style={{ paddingLeft: ".5em" }}></img></a>
      {props.researchURLs.map((rurl) => {
        const imgWidth = 50;
        const imgHeight = 50;
        if (rurl.url.value.toString().includes("github")) {
          return <a href={rurl.url.value} target="_blank"><img width={imgWidth} height={imgHeight} src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"></img></a>
        } else if (rurl.url.value.toString().includes("npmjs.com")) {
          return <a href={rurl.url.value} target="_blank"><img width={imgWidth} height={23} src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/2560px-Npm-logo.svg.png"></img></a>
        } else if (rurl.url.value.toString().includes("twitter.com")) {
          return <a href={rurl.url.value} target="_blank"><img width={40} height={40} src="https://www.danoneinstitute.org/wp-content/uploads/2020/06/logo-rond-twitter.png"></img></a>
        }
      })}
    </div>)

}


export default OrcidIconBar;