import React from "react";
import { Row, Col, Container } from "react-bootstrap";

class Footer extends React.Component {
  render() {
    return (
      <>
        <section className="section pt-5 pb-5 text-center bg-white">
          <Container>
            <Row>
              <Col sm={12}>
                <p style={{ fontSize: "22px" }} className="m-0 text-dark">
                  Operate food store or restaurants?{" "}
                  <a href="/register?tab=business">Work With Us</a>
                </p>
              </Col>
            </Row>
          </Container>
        </section>
      </>
    );
  }
}

export default Footer;
