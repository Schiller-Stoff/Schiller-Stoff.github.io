import React from "react";
import { Orcid } from "../../../types/orcid";

interface Props {
  orcidRoot: Orcid.RootObject;
}

/**
 * Renders entry for personal website based on given ORCID root object data.
 */
const OrcidEntry: React.FC<Props> = ({ orcidRoot }) => {
  return (
    <>
      <h1 className="pt-md-3 h2" id="start">
        Hi, I'm{" "}
        <span className="text-decoration-underline">
          {orcidRoot.person.name["given-names"].value}{" "}
          {orcidRoot.person.name["family-name"].value}
        </span>
      </h1>
      <h2 className="text-secondary h4">
        {
          orcidRoot["activities-summary"].employments["employment-summary"][0][
            "role-title"
          ]
        }{" "}
        at{" "}
        {
          orcidRoot["activities-summary"].employments["employment-summary"][0]
            .organization.name
        }
      </h2>
    </>
  );
};

export default OrcidEntry;
