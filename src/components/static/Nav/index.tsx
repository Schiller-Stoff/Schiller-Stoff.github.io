import React from "react";
import { Container, Navbar, NavDropdown, Nav } from "react-bootstrap";
import { Link } from "gatsby";

const MyNav = () => {

  return (
      <Navbar collapseOnSelect expand="lg">
        <Container>
        <Nav>
          <Nav.Link as="li">
            <Link to="/" className="text-dark text-decoration-none">
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
