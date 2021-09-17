import React from "react";
import { Button } from "react-bootstrap";
import { Orcid } from "../../../types/orcid";
import MyStringUtils from "../../../utils/MyStringUtils";
import OrcidIconBar from "../OrcidIconBar";

interface Props {
  orcidRoot: Orcid.RootObject
}

const OrcidSideNav: React.FC<Props> = (props) => {

  const resolvePersName = (root: Orcid.RootObject) => {
    const foreName = MyStringUtils.catchToString(() => root.person.name["given-names"].value.toString());
    const familyName = MyStringUtils.catchToString(() => root.person.name["family-name"].value.toString());
    return foreName + " " + familyName;
  }

  return <div className="text-center text-light">
    <br />
    <h2 className="h5 fw-bold">
      {resolvePersName(props.orcidRoot)}
    </h2>
    <img
      alt="Main profile picture"
      src={
        process.env.LINK_TO_PROFILE_IMG
          ? process.env.LINK_TO_PROFILE_IMG
          : "/img/profile.jpg"
      }
      width={150}
      height={150}
      style={{ borderRadius: "100%", filter: "grayscale(150%)" }}
    ></img>
    <p className="text-light">
      <small>Hi, my name is {resolvePersName(props.orcidRoot)} and I'm {props.orcidRoot["activities-summary"].employments["employment-summary"][0][
        "role-title"
      ]}. Welcome to my personal page!</small>
    </p>
    <OrcidIconBar
      orcidURL={props.orcidRoot["orcid-identifier"].uri}
      researchURLs={
        props.orcidRoot.person["researcher-urls"][
        "researcher-url"
        ]
      }
      mail={
        props.orcidRoot.person.emails.email[0] &&
        props.orcidRoot.person.emails.email[0].email
      }
    />
    <hr />
    <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
      <li>Home</li>
      <li>Biography</li>
      <li>Emmployments</li>
      <li>Educations</li>
      <li>Works</li>
    </ul>

    <hr />
    <Button variant="warning" style={{ textAlign: "left" }}>Get in Touch</Button>
  </div>

}


export default OrcidSideNav;