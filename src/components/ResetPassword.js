import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Container, Form, Image } from 'react-bootstrap';
import { UserContext } from '../components/providers/AuthProvider';
import { toast } from 'react-toastify';
import { validateEmail } from '../utils';
import { auth } from '../firebase';
import Seo from './Seo';


const Login = () => {
  const history = useHistory();
  const user = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if ((user && user.role !== "business")) {
    history.replace("/myaccount/orders");
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if ((email === '')) {
      toast.error("Email and Password cannot be empty");
      return;
    }

    if (!email || !(validateEmail(email))) {
      toast.error("Please enter a valid email address");
      return;
    }
    sendResetPasswordEmail()
  }

  const sendResetPasswordEmail = () => {
    setLoading(true);

    auth.sendPasswordResetEmail(email)
      .then(() => {
        setLoading(false);
        toast.info("An email has been sent with instructions to reset your password");
      })

      .catch(() => {
        setLoading(false);
        toast.error("Reset password failed");
      })
  }

  // seo
  const seo = {
    metaTitle: 'Reset Password | ZeepDash',
    metaDescription: 'Reset your password on ZeepDash'
  }

  return (
    <>
      <Seo seo={seo} />
      <Container fluid className='bg-white'>
        <Row>
          <Col md={4} lg={6} className="d-none d-md-flex bg-image"></Col>
          <Col md={8} lg={6}>
            <div className="login d-flex align-items-center py-5">
              <Container className="auth-animation">
                <Row>
                  <Col md={9} lg={8} className="mx-auto pl-5 pr-5">
                    <h2 className="login-heading mb-4">Reset your password</h2>
                    <Form onSubmit={(evt) => { evt.preventDefault() }}>
                      <div className="form-label-group">
                        <input className="input" onChange={(evt) => setEmail(evt.target.value)} type="email" id="inputEmail" placeholder="Email" />
                      </div>
                      <button disabled={loading ? true : false} onClick={handleSubmit} className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2">
                        {!loading && <span>Reset Password</span>}
                        {loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
                      </button>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Login;
