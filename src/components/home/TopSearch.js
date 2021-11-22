import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import CuisinesCarousel from "../common/CuisinesCarousel";

const TopSearch = ({ cuisines }) => {
  return (
    <section className="pt-5 pb-5 homepage-search-block position-relative">
      <div className="banner-overlay"></div>
      <Container>
        <Row className="d-flex align-items-center">
          <Col md={8}>
            <div className="homepage-search-title">
              <h1 className="mb-4 font-weight-normal">
                <span className="font-weight-bold">Find awesome meals</span> in
                Ibadan.
              </h1>
              <p
                style={{ fontSize: "17px" }}
                className="mb-5 text-dark font-weight-normal"
              >
                Lists of top restaurants, cafes, pubs, and bars in Ibadan.
              </p>
            </div>
            <CuisinesCarousel cuisines={cuisines} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TopSearch;
