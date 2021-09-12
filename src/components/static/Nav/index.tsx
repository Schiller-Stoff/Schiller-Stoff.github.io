import React from "react";
import { Container, Navbar, NavDropdown, Nav } from "react-bootstrap";
import { Link } from "gatsby";

interface Props {
  title: string;
}

const MyNav: React.FC<Props> = (props) => {

  const navStyle: React.CSSProperties = {
    fontSize: "1em",
    fontWeight: 600,
    color: "grey"
  }

  return (
      <Navbar collapseOnSelect expand="lg">
        <Container>
        <Nav style={navStyle}>
          <Nav.Link as="li">
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
            <Nav style={navStyle}>
              <Nav.Link as="li">
                <Link to="/about" className="text-dark text-decoration-none">About</Link>
              </Nav.Link>
              <Nav.Link
                href="#features"
                as="li"
              >
                <Link to="/projects" className="text-dark text-decoration-none">Projects</Link>
              </Nav.Link>
              <Nav.Link href="#features" as="li">
                <Link to="/contact" className="text-dark text-decoration-none">Contact</Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};

export default MyNav;
