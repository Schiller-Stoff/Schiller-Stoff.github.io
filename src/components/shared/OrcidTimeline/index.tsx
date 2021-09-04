import React from "react";
import { Orcid } from "../../../types/orcid";
import { Chrono } from "react-chrono";

interface Props {
  orcidSequence:
    | Orcid.Educations
    | Orcid.Employments
    | Orcid.Fundings
    | Orcid.PeerReviews
    | Orcid.Works;
  mode?: "VERTICAL" | "VERTICAL_ALTERNATING" | "HORIZONTAL"
}

interface TimelineEntry {
  title: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardDetailedText?: string;
}

/**
 * Handles conversion of data to correct model of used Timeline component
 * @returns
 */
const OrcidTimeline: React.FC<Props> = (props) => {
  /**
   *
   * @param propData
   * @returns
   */
  const transformData = (propData: Props): TimelineEntry[] => {
    if (propData.orcidSequence["education-summary"]) {
      let eduSequence = propData.orcidSequence as Orcid.Educations;
      return handleEduData(eduSequence);
    } else if (propData.orcidSequence["education-summary"]) {
      let emplSequence = propData.orcidSequence as Orcid.Employments;
    } else {
      return [
        {
          title: "WRONG!!!",
        },
      ];
    }

    //(propData.orcidSequence as Orcid.Fundings).;
  };

  const handleEduData = (eduSequence: Orcid.Educations): TimelineEntry[] => {
    return eduSequence["education-summary"].map((edu) => {
      return {
        title: "",
        cardTitle: edu["role-title"],
        cardSubtitle: edu.organization.name,
        cardDetailedText: edu.organization["disambiguated-organization"]["disambiguated-organization-identifier"]
      };
    });
  };

  return (
    <div>
      <Chrono
        items={transformData(props)}
        mode={props.mode}
        theme={{ primary: "grey", secondary: "white" }}
        hideControls
        scrollable
      />
    </div>
  );
};

export default OrcidTimeline;
