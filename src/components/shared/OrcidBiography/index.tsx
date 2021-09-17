import React from "react";
import { Orcid } from "../../../types/orcid";
import MyStringUtils from "../../../utils/MyStringUtils";

interface Props {
  orcidRoot: Orcid.RootObject;
  className?: string
}

const OrcidBiography: React.FC<Props> = (props) => {

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
      return (<div className={props.className}>
        <p className="">{bioOrcid}</p>
      </div>)
    };
  }

  return renderConditional(props.orcidRoot);

}

export default OrcidBiography;