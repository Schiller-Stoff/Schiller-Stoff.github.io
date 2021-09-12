import React from "react";
import { Orcid } from "../../../types/orcid";
import MyStringUtils from "../../../utils/MyStringUtils";
import MyNav from "../../static/Nav";

interface Props {
  orcidRoot: Orcid.RootObject;
}

/**
 * Nav rendered according to given ORCID-APIv2 root object.
 */
const OrcidNav: React.FC<Props> = (props) => {
  /**
   * Prefers the first alsoKnownAs name given to ORCID. Falls back to main name if not provided.
   * @param root orcid root object
   * @returns name extracted of orcid data as string
   */
  const buildName = (root: Orcid.RootObject) => {
    // prefer check if also known as is defined -> prefered label to show
    let firstAlsoKnownAs = MyStringUtils.catchToString(
      () => root.person["other-names"]["other-name"][0].content
    );
    if (firstAlsoKnownAs) return firstAlsoKnownAs;

    // else use first + familenames
    let name = "";

    // add firstnames.
    name += MyStringUtils.catchToString(
      () => root.person["other-names"]["other-name"][0].content
    );

    //add last name.
    name += MyStringUtils.catchToString(() =>
      root.person.name["family-name"].value.toString()
    );

    return name;
  };

  const buildNavSideLinks = (root: Orcid.RootObject) => {
    let sideLinks: { label: string; href: string }[] = [];

    if (root["activities-summary"].works.group[0]) {
      sideLinks.push({
        label: "Works",
        href: "#works",
      });
    }

    if (root["activities-summary"].educations["education-summary"][0]) {
      sideLinks.push({
        label: "Educations",
        href: "#educations",
      });
    }

    if (root["activities-summary"].employments["employment-summary"][0]) {
      sideLinks.push({
        label: "Employments",
        href: "#employments",
      });
    }

    if (root["activities-summary"].fundings.group[0]) {
      sideLinks.push({
        label: "Fundings",
        href: "#fundings",
      });
    }

    if (root["activities-summary"]["peer-reviews"].group[0]) {
      sideLinks.push({
        label: "Peer Reviews",
        href: "#peerreviews",
      });
    }

    return sideLinks.length > 1 ? sideLinks : null;
  };

  return (
    <MyNav
      title={buildName(props.orcidRoot)}
      sideLinks={buildNavSideLinks(props.orcidRoot)}
    />
  );
};

export default OrcidNav;
