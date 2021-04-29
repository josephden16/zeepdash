import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Container } from 'react-bootstrap';


const NotSignedIn = () => {
  return (
    <section className="section pt-4 pb-4">
      <h5 style={{ marginTop: '40px' }} className="text-center mb-6">You must be signed in to access this page, <Link to="/login">click here to sign in.</Link></h5>
      <Container style={{ marginTop: '50px' }}>
        <Row className="align-self-center">
          <img className="w-25 text-center m-auto" draggable={false} src="/img/illustrations/signin-illstration.svg" alt="Sign in" />
        </Row>
      </Container>
    </section>
  )
}

export default NotSignedIn;
