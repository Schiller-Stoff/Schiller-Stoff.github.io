import { faGithub, faMailchimp, faNpm, faOrcid, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Orcid } from "../../../types/orcid";

interface Props {
  orcidURL: string;
  mail?: string;
  researchURLs: Orcid.ResearcherUrl[];
}


const OrcidIconBar: React.FC<Props> = (props) => {

  const faIconStyle: React.CSSProperties =  {
    height:30, 
    width:30, 
    marginRight:".5em", 
    display:"inline-block"
  }

  console.log(props)
  debugger;

  return (
    <div>
      {props.mail && <a style={faIconStyle} href={`mailTo:${props.mail}`}><FontAwesomeIcon icon={faEnvelope} size="2x"></FontAwesomeIcon></a>}
    
      <a style={faIconStyle} href={props.orcidURL} target="_blank"><FontAwesomeIcon icon={faOrcid} size="2x"></FontAwesomeIcon></a>
      {props.researchURLs.map((rurl) => {
        const imgWidth = 50;
        const imgHeight = 50;
        if (rurl.url.value.toString().includes("github")) {
          return <a style={faIconStyle} href={rurl.url.value} target="_blank"><FontAwesomeIcon icon={faGithub} size="2x"></FontAwesomeIcon></a>
        } else if (rurl.url.value.toString().includes("npmjs.com")) {
          return <a style={faIconStyle} href={rurl.url.value} target="_blank"><FontAwesomeIcon icon={faNpm} size="2x"></FontAwesomeIcon></a>
        } else if (rurl.url.value.toString().includes("twitter.com")) {
          return <a style={faIconStyle} href={rurl.url.value} target="_blank"><FontAwesomeIcon icon={faTwitter} size="2x"></FontAwesomeIcon></a>
        }
      })}
    </div>)

}


export default OrcidIconBar;