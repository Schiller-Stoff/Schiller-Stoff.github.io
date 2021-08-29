import React from "react";
import { Container, Navbar, NavDropdown, Nav } from "react-bootstrap";
import { Link } from "gatsby";

const MyNav = () => {

  return (
      <Navbar collapseOnSelect expand="lg">
        <Container>
        <Nav>
          <Nav.Link>
            <Link to="/">
              Sebastian Stoff
            </Link>
          </Nav.Link>
          </Nav>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end px-4"
          >
            <Nav>
              <Nav.Link as="li">
                <Link to="/about">About</Link>
              </Nav.Link>
              <Nav.Link
                href="#features"
                as="li"
              >
                <Link to="/projects">Projects</Link>
              </Nav.Link>
              <Nav.Link href="#features" as="li">
                <Link to="/contact">Contact</Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};

export default MyNav;