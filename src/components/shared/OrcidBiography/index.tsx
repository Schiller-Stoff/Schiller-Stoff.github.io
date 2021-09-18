import React from "react";
import { Orcid } from "../../../types/orcid";
import MyStringUtils from "../../../utils/MyStringUtils";

interface Props {
  orcidRoot: Orcid.RootObject;
  className?: string
}

const OrcidBiography: React.FC<Props> = (props) => {

  /**
   * Adds breaks between different sentences in given text via ORCID.
   * @param bio 
   * @returns 
   */
  const increaseReadability = (bio: string) => {
    const split = bio.split(".");
    if(split.length < 3)return <p>{bio}</p>;

    let elems = [];
    split.forEach((bioSentence, index) => {
      if((index % 2) === 0 && (index > 1)){
        elems.push(bioSentence);
        elems.push(".")
        elems.push(<br key={index + "br" + "1"}/>)
        elems.push(<br key={index + "br" + "2"}/>)
      } else {
        elems.push(bioSentence);
        elems.push(".");
      }
      
    });

    return elems;
  }

  /**
   * Renders content conditionally according to given orcid API response.
   * @param root orcidRoot object
   * @returns either valid JSX or null when no biography was given.
   */
  const renderConditional = (root: Orcid.RootObject): null | JSX.Element => {
    const bioOrcid = MyStringUtils.catchToString(() => root.person.biography.content);

    if(!bioOrcid){
      return null
    } else {
      return (<div id="biography" className={props.className}>
        <div className="">{ increaseReadability(bioOrcid)}</div>
      </div>)
    };
  }

  return renderConditional(props.orcidRoot);

}

export default OrcidBiography;