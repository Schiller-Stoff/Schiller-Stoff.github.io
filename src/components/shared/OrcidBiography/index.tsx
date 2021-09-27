import React from "react";
import { Orcid } from "../../../types/orcid";
import MyStringUtils from "../../../utils/MyStringUtils";

interface Props {
  orcidRoot: Orcid.RootObject;
  className?: string
}

const OrcidBiography: React.FC<Props> = (props) => {

  const [bioLength, setBioLength] = React.useState<"shortest" | "short" | "medium" | "full">("shortest");


  /**
   * Adds breaks between different sentences in given text via ORCID.
   * @param bio 
   * @returns 
   */
  const increaseReadability = (bio: string, wishedLength: "shortest" | "short" | "medium" | "full") => {
    bio = adaptLength(bio, wishedLength);

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
   * Reduces length of given text according to "." dots in the text. Reductions is done
   * according to given second parameter.
   * @param bio text to reduce in sentences.
   * @param wishedLength length spec defined as enums.
   * @returns reduced text
   */
  const adaptLength = (bio: string, wishedLength: "shortest" | "short" | "medium" | "full") => {

    let bioSplit = bio.split(".");

    switch(wishedLength){
      case "shortest":
        return bioSplit[0] + "."
      case "short":
        return `${bioSplit[0]}.${bioSplit[1]}.`
      case "medium":
        return `${bioSplit[0]}.${bioSplit[1]}.${bioSplit[2]}.${bioSplit[3]}.`
      case "full":
        return bio;
      default:
        return bio;
    }

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
        <div className="">{ increaseReadability(bioOrcid, bioLength)}</div>
      </div>)
    };
  }

  return (
  <> 
    <div>
      <input defaultChecked={bioLength === "shortest"} type="radio" id="orcid_bio_radio1" name="fav_language" onClick={() => setBioLength("shortest")}></input>
      <input className="ms-1" type="radio" id="orcid_bio_radio2" name="fav_language" onClick={() => setBioLength("short")}></input>
      <input className="ms-1" type="radio" id="orcid_bio_radio3" name="fav_language" onClick={() => setBioLength("medium")}></input>
      <input className="ms-1" type="radio" id="orcid_bio_radio4" name="fav_language" onClick={() => setBioLength("full")}></input>
      <small style={{color: "lightgrey"}}> | Chosen length: {bioLength}</small>
    </div>
    {renderConditional(props.orcidRoot)}
  </>)

}

export default OrcidBiography;