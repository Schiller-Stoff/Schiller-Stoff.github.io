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
    color:"black",
    background:"whitesmoke",
  }

  return (
    <div>
      {props.mail && <a aria-label="Write me an e-mail" style={faIconStyle} href={`mailTo:${props.mail}`}><FontAwesomeIcon icon={faEnvelope} size="1x"></FontAwesomeIcon></a>}

      <a rel="noopener" style={faIconStyle} href={props.orcidURL} target="_blank" aria-label="See my ORCID record."><FontAwesomeIcon icon={faOrcid} size="1x"></FontAwesomeIcon></a>
      {props.researchURLs.map((rurl, index) => {
        if (rurl.url.value.toString().includes("github")) {
          return <a aria-label="See my code on github" rel="noopener" style={faIconStyle} key={index} href={rurl.url.value.toString()} target="_blank"><FontAwesomeIcon icon={faGithub} size="1x"></FontAwesomeIcon></a>
        } else if (rurl.url.value.toString().includes("npmjs.com")) {
          return <a aria-label="Find my javascript code on npmjs.com" rel="noopener" style={faIconStyle} key={index} href={rurl.url.value.toString()} target="_blank"><FontAwesomeIcon icon={faNpm} size="1x"></FontAwesomeIcon></a>
        } else if (rurl.url.value.toString().includes("twitter.com")) {
          return <a aria-label="Connect with me on twitter.com" rel="noopener" style={faIconStyle} key={index} href={rurl.url.value.toString()} target="_blank"><FontAwesomeIcon icon={faTwitter} size="1x"></FontAwesomeIcon></a>
        }
      })}
    </div>)

}


export default OrcidIconBar;