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


/**
 * Handles display of orcid research urls as icons
 * @param props 
 * @returns 
 */
const OrcidIconBar: React.FC<Props> = (props) => {

  const faIconStyle: React.CSSProperties = {
    height: 30,
    width: 30,
    marginRight: ".5em",
    display: "inline-block",
    color:"black"
  }

  return (
    <div>
      {props.mail && <a style={faIconStyle} href={`mailTo:${props.mail}`}><FontAwesomeIcon icon={faEnvelope} size="2x"></FontAwesomeIcon></a>}

      <a rel="noopener" style={faIconStyle} href={props.orcidURL} target="_blank"><FontAwesomeIcon icon={faOrcid} size="2x"></FontAwesomeIcon></a>
      {props.researchURLs.map((rurl, index) => {
        if (rurl.url.value.toString().includes("github")) {
          return <a rel="noopener" style={faIconStyle} key={index} href={rurl.url.value.toString()} target="_blank"><FontAwesomeIcon icon={faGithub} size="2x"></FontAwesomeIcon></a>
        } else if (rurl.url.value.toString().includes("npmjs.com")) {
          return <a rel="noopener" style={faIconStyle} key={index} href={rurl.url.value.toString()} target="_blank"><FontAwesomeIcon icon={faNpm} size="2x"></FontAwesomeIcon></a>
        } else if (rurl.url.value.toString().includes("twitter.com")) {
          return <a rel="noopener" style={faIconStyle} key={index} href={rurl.url.value.toString()} target="_blank"><FontAwesomeIcon icon={faTwitter} size="2x"></FontAwesomeIcon></a>
        }
      })}
    </div>)

}


export default OrcidIconBar;