import React from "react";
import { Orcid } from "../../../types/orcid";
import MyStringUtils from "../../../utils/MyStringUtils";
import Head from "../Head";

interface Props {
  orcidRoot: Orcid.RootObject;
}

/**
 * Component that handles generation of <head> element based on data provided by ORCID.
 * @param props.orcidRoot root object of ORCID public API response 
 */
const OrcidHead: React.FC<Props> = (props) => {

  /**
   * Reduces ORCIDs keyword-objec-array to a simple string array. 
   * @param root root object of ORCID public API response 
   * @returns {string[] | null} keywords as string-array or null if empty / undefined.
   */
  const reduceOrcidKeywords = (root: Orcid.RootObject): string[] | null => {
    if(!root.person.keywords.keyword[0])return null;
    // reduce to string array
    const kwords = root.person.keywords.keyword;
    const reducedKwords: string[] = kwords.reduce((agg: string[], val) => {
      agg.push(val.content);
      return agg;
    }, [])
    if(reducedKwords.length === 0)return null;
    return reducedKwords;
  }

  return (
    <Head
      keywords={reduceOrcidKeywords(props.orcidRoot)}
    />
  );
};

export default OrcidHead;
