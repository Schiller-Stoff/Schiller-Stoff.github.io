import React from "react";
import { Orcid } from "../../../types/orcid";
import MyStringUtils from "../../../utils/MyStringUtils";
import MyNav from "../../static/Nav";

interface Props {
  orcidRoot: Orcid.RootObject;
}

/**
 *
 */
const OrcidNav: React.FC<Props> = (props) => {
  const buildName = (root: Orcid.RootObject) => {
    // prefer check if also known as is defined -> prefered label to show
    let firstAlsoKnownAs = MyStringUtils.catchToString(
      () => root.person["other-names"]["other-name"][0].content
    );
    if(firstAlsoKnownAs) return firstAlsoKnownAs;

    // else use first + familenames
    let name = "";

    // add firstnames.
    name += MyStringUtils.catchToString(() =>
      root.person["other-names"]["other-name"][0].content
    );

    //add last name.
    name += MyStringUtils.catchToString(() =>
      root.person.name["family-name"].value.toString()
    );

    return name;
  };

  return <MyNav title={buildName(props.orcidRoot)} />;
};

export default OrcidNav;
