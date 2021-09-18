import React from "react";
import { Container, Navbar, NavDropdown, Nav } from "react-bootstrap";
import { Link } from "gatsby";

interface Props {
  title: string;
  sideLinks?: {
    label: string;
    href: string;
  }[];
}

const MyNav: React.FC<Props> = (props) => {
  const navStyle: React.CSSProperties = {
    fontSize: "1em",
    fontWeight: 600,
    color: "grey",
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="d-lg-none">
      <Container>
        <Nav style={navStyle}>
          <Nav.Link className="h6" as="div">
            <Link to="/" className="text-dark text-decoration-none">
              {props.title}
            </Link>
          </Nav.Link>
        </Nav>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end px-4"
        >
          <NavDropdown title="Content" id="nav-dropdown">
            {props.sideLinks ? (
              props.sideLinks.map((linkObj, index) => (
                <Nav.Link key={linkObj.href + index} as="li">
                  <Link
                    to={linkObj.href}
                    className="text-dark text-decoration-none"
                  >
                    {linkObj.label}
                  </Link>
                </Nav.Link>
              ))
            ) : (
              <>
                <NavDropdown.Item>
                  <Link to="/" className="text-dark text-decoration-none" as="div">
                    Home
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item href="#features" as="div">
                  <Link
                    to="/projects"
                    className="text-dark text-decoration-none"
                  >
                    Projects
                  </Link>
                </NavDropdown.Item>
                {/* <NavDropdown.Item href="#features" as="li">
                  <Link
                    to="/contact"
                    className="text-dark text-decoration-none"
                  >
                    Contact
                  </Link>
                </NavDropdown.Item> */}
              </>
            )}

          </NavDropdown>
          <Nav.Link as="div">
            <Link to="/" className="text-dark text-decoration-none">
              Home
            </Link>
          </Nav.Link>
          {/* <Nav.Link href="#features" as="li">
            <Link
              to="/contact"
              className="text-dark text-decoration-none"
            >
              Contact
            </Link>
          </Nav.Link> */}
          <Nav.Link as="div">
            <Link to="/imprint" className="text-dark text-decoration-none">
              Imprint
            </Link>
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;
