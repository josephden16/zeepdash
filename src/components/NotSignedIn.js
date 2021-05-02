import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Container } from 'react-bootstrap';


const NotSignedIn = () => {
  return (
    <section className="section pt-4 pb-4">
      <p style={{ marginTop: '40px', fontSize: '16px' }} className="text-center h5 mb-6 ml-1 mr-1">You must be signed in to access this page, <Link to="/login">click here to sign in.</Link></p>
      <Container style={{ marginTop: '50px' }}>
        <Row className="align-self-center">
          <img className="w-50 text-center m-auto" draggable={false} src="/img/illustrations/signin-illstration.svg" alt="Sign in" />
        </Row>
      </Container>
    </section>
  )
}

export default NotSignedIn;
