import { Link } from "gatsby";
import React from "react";
import { Button, Nav } from "react-bootstrap";
import { Orcid } from "../../../types/orcid";
import MyStringUtils from "../../../utils/MyStringUtils";

interface Props {
  orcidRoot: Orcid.RootObject;
}

const OrcidSideNav: React.FC<Props> = (props) => {
  const resolvePersName = (root: Orcid.RootObject) => {
    const foreName = MyStringUtils.catchToString(() =>
      root.person.name["given-names"].value.toString()
    );
    const familyName = MyStringUtils.catchToString(() =>
      root.person.name["family-name"].value.toString()
    );
    return foreName + " " + familyName;
  };

  const linkStyle = {
    fontFamily: '"SF Mono","Fira Code","Fira Mono","Roboto Mono",monospace',
    color:"#ccd6f6"
  }

  return (
    <div
      id="sideNav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "200px",
        height: "100vh",
        padding: "1.25em",
        color:"#ccd6f6",
        fontSize:".9em"
        //background:"#f2f5f4"
        // borderRight: "3px solid lightgrey" 
      }}
      className="text-center text-black d-none d-lg-block"
    >
      <Nav defaultActiveKey="/home" className="flex-column text-center">
        <Nav.Link as="div" className="text-dark p-0">
          <Link style={linkStyle} activeClassName="active" className="text-decoration-none" to="/">
            Home/Bio
          </Link>{" "}
        </Nav.Link>
        <Nav.Link as="div" className="text-dark p-0">
          <Link style={linkStyle} activeClassName="active" className="text-decoration-none" to="/portfolio/">
            Portfolio
          </Link>{" "}
        </Nav.Link>
        <Nav.Link as="div" className="text-dark p-0">
          <Link style={linkStyle} activeClassName="active" className="text-decoration-none" to="/stories/">
            Stories
          </Link>
        </Nav.Link>
        <Nav.Link as="div" className="text-dark p-0">
          <Link style={linkStyle} activeClassName="active" className="text-decoration-none" to="/blog/">
            Blog
          </Link>{" "}
        </Nav.Link>
        {/* <Nav.Link as="div" eventKey="link-1" className="text-dark p-0">
          <Link style={linkStyle} activeClassName="active" className="text-decoration-none" to="/#biography">
            Biography
          </Link>
        </Nav.Link> */}
        <Nav.Link as="div" eventKey="link-2" className="text-dark p-0">
          <Link style={linkStyle} activeClassName="active" className="text-decoration-none" to="/contact">
          Contact
          </Link>
        </Nav.Link>
        <Nav.Link as="div" eventKey="link-5" className="text-dark p-0">
          <Link style={linkStyle} activeClassName="active" className="text-decoration-none" to="/imprint">
          Imprint
          </Link>
        </Nav.Link>
        {/* <Nav.Link as="div" eventKey="link-2" className="text-dark p-0">
          <Link activeClassName="active" className="text-dark text-decoration-none" to="/#employments">
            Employment
          </Link>
        </Nav.Link>
        <Nav.Link as="div" eventKey="link-3" className="text-dark p-0">
          <Link activeClassName="active" className="text-dark text-decoration-none" to="/#works">
            Projects &amp; works
          </Link>
        </Nav.Link>
        <Nav.Link as="div" eventKey="link-4" className="text-dark p-0">
          <Link activeClassName="active" className="text-dark text-decoration-none" to="/#educations">
            Education
          </Link>
        </Nav.Link>
         */}
      </Nav>

      {/* <hr style={{borderTop: "5px dotted whitesmoke"}}/> */}
      {/* <a
        aria-label="Write a mail to the author of the page"
        className="btn btn-secondary"
        href={`mailto:${props.orcidRoot.person.emails.email}`}
      >
        Get in touch
      </a> */}
    </div>
  );
};

export default OrcidSideNav;
