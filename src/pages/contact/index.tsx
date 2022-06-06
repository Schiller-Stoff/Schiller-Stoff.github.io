import React from "react";
import BaseLayout from "../../components/shared/layouts/BaseLayout";
import OrcidHead from "../../components/shared/OrcidHead";
import OrcidIconBar from "../../components/shared/OrcidIconBar";
import OrcidNav from "../../components/shared/OrcidNav";
import { Orcid } from "../../types/orcid";

const ContactPage: React.FC<{ pageContext: { persOrcid: Orcid.RootObject } }> =
  (props) => {
    return (
      <BaseLayout
        orcidRoot={props.pageContext.persOrcid}
        headComponent={
          <OrcidHead orcidRoot={props.pageContext.persOrcid}></OrcidHead>
        }
        nav={<OrcidNav orcidRoot={props.pageContext.persOrcid} />}
      >
        <h1>Contact</h1>

        <h2 className="h5 mb-4" style={{ fontWeight: 300, fontSize: "1.35em" }}>
          Email, twitter, linkedIn etc.
        </h2>
        <hr />
        <OrcidIconBar
          orcidURL={props.pageContext.persOrcid["orcid-identifier"].uri}
          researchURLs={
            props.pageContext.persOrcid.person["researcher-urls"][
              "researcher-url"
            ]
          }
          mail={
            props.pageContext.persOrcid.person.emails.email[0] &&
            props.pageContext.persOrcid.person.emails.email[0].email
          }
        ></OrcidIconBar>
        <br></br>
        {props.pageContext.persOrcid.person.emails.email[0] &&
          props.pageContext.persOrcid.person.emails.email[0].email && (
            <p>
              <b>Contact mail:</b>{" "}
              {props.pageContext.persOrcid.person.emails.email[0].email}
            </p>
          )}
        <p>
          <b>ORCID:</b> {props.pageContext.persOrcid["orcid-identifier"].uri}
        </p>

        <ul>
          {props.pageContext.persOrcid.person["researcher-urls"][
            "researcher-url"
          ].map((researchUrl) => (
            <li>
              <a target="_blank" href={researchUrl.url.value.toString()}>
                {researchUrl["url-name"]}
              </a>
            </li>
          ))}
        </ul>
        <br></br>
        <br></br>
        <br></br>
      </BaseLayout>
    );
  };

export default ContactPage;
