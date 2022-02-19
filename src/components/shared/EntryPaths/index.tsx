import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import ContentHeading from "../ContentHeading";


const EntryPaths = () => {

  const cards = [
    {
      title: "Portfolio"
    },
    {
      title: "Biography"
    },
    {
      title: "Contact"
    }
  ]


  return (
    <>
      <ContentHeading>Select or scroll</ContentHeading>
      <Row xs={1} md={3} className="g-4 mt-1">
        {cards.map((card, idx) => (
          <Col>
            <Card bg="white" className="border-0 rounded-0 border-dark">
              {/* <Card.Img variant="top" src={
                process.env.LINK_TO_PROFILE_IMG
                  ? process.env.LINK_TO_PROFILE_IMG
                  : "/img/profile.jpg"
              } /> */}
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

}


export default EntryPaths;