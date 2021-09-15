import React from "react";
import { Container } from "react-bootstrap";
import { Orcid } from "../../../../types/orcid";
import MyStringUtils from "../../../../utils/MyStringUtils";

interface Props {
  orcidWorkSummary: Orcid.WorkSummary
}

const OrcidWorkCard: React.FC<Props> = (props) => {
  const orcidData = props.orcidWorkSummary as Orcid.WorkSummary;
  return (
    <Container style={{ position: "absolute" }}>
      <h4 className="h6 fw-bold">{props.data.cardTitle}</h4>
      <p>
        {props.data.cardSubtitle
          .replace("OTHER", "SOFTWARE")
          .replace("DISSERTATION", "THESIS")}
      </p>
      <p
        style={{
          position: "relative",
          left: "-110px",
          fontWeight: 600,
        }}
      >
        {props.data.title}
      </p>
      {() => {
        let href = MyStringUtils.catchToString(() =>
          orcidData["external-ids"]["external-id"][0][
            "external-id-url"
          ].value.toString()
        );
        if (href) {
          return (
            <a
              className="text-secondary"
              target="_blank"
              href={href}
            >
              {href && "Visit related project page"}
            </a>
          );
        } else {
          return null;
        }
      }}
    </Container>
  );
}