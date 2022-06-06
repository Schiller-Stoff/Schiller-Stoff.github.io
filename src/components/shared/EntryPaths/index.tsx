import { Link } from "gatsby";
import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import ContentHeading from "../ContentHeading";

const EntryPaths = () => {
  const cards = [
    {
      title: "Portfolio",
      to: "/portfolio/",
    },
    {
      title: "Biography",
      to: "/bio/",
    },
    {
      title: "Contact",
      to: "/contact/",
    },
  ];

  return (
    <>
      {/* <ContentHeading>Select or scroll</ContentHeading> */}
      <Row xs={1} md={3} className="g-4">
        {cards.map((card, i) => (
          <Col key={i}>
            <Link to={card.to} className="text-decoration-none">
              <Card className="pb-5">
                <Card.Body>
                  <Card.Title className="h6">{card.title}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default EntryPaths;
