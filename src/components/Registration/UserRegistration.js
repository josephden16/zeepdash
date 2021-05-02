import React, { useState, useRef, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Row, Col, Form, Image } from 'react-bootstrap';
import { auth, firestore, setPersistenceSession } from '../../firebase';
import { validateEmail, validateName, validatePassword, validatePhoneNumber, formatPhoneNumber } from '../../utils';
import { toast } from 'react-toastify';
import { UserContext } from '../providers/AuthProvider';
import Seo from '../Seo';



const UserRegistration = ({ className }) => {
  const user = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef(null);

  const history = useHistory();

  const registerWithEmailAndPassword = (email, password) => {
    setLoading(true);
    // sign out the user is already signed in
    if (user) {
      auth.signOut();
    }
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in 
        setPersistenceSession();
        setLoading(false);
        var user = userCredential.user;
        const usersCollectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
        const userRef = firestore.collection(usersCollectionName).doc(user.uid);
        userRef.get()
          .then(snapshot => {
            if (snapshot.exists) {
              toast.warning("User exists with this email address");
            } else {
              let phonenumber = formatPhoneNumber(phoneNum);
              firestore.collection(usersCollectionName).doc(user.uid).set({
                email: user.email,
                role: 'customer',
                phone: phonenumber,
                name: name,
                dateJoined: new Date(),
                locations: []
              }).then(() => {
                toast.success("Account created successfully");
                history.push("/");
              })
                .catch(() => {
                  toast.error("Failed to create account");
                })
            }
          })
      })
      .catch((error) => {
        setLoading(false);
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // console.log(`Error Code: ${errorCode}, Error Message: ${errorMessage}`);
        toast.error("An unknown error occured, please try again later");
      });
  }

  const validateFormData = () => {
    if (!(name && email && password && phoneNum)) {
      toast.error("Please fill all form fields");
      return;
    }

    if (!name || !validateName(name)) {
      toast.error("Please enter a valid name");
      return;
    }

    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid name");
      return;
    }

    if (!phoneNum || !validatePhoneNumber(phoneNum)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!password || !validatePassword(password)) {
      toast.error("Please enter a valid password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter");
      return;
    }


    return true;

  }

  const handleRegistration = (evt) => {
    evt.preventDefault();
    const isFormValid = validateFormData();
    if (isFormValid) {
      registerWithEmailAndPassword(email, password);
    }
  }

  const togglePassword = () => {
    if (passwordRef.current.type === 'password') {
      passwordRef.current.type = 'text';
      setPasswordVisible(true);
    } else {
      passwordRef.current.type = 'password';
      setPasswordVisible(false);
    }
  }

  return (
    <>
      <Seo seo={seo} />
      <Row>
        <Col md={9} lg={8} className={`mx-auto pl-5 pr-5 ${className}`}>
          <div className="text h4 mb-4 ml-0">
            <Link to="/register" className="text-orange bg-white border-white cursor-pointer">Personal</Link> / <Link to="/register?tab=business" className="text-black border-white bg-white cursor-pointer hover-orange">Business</Link>
          </div>
          <h3 className="login-heading mb-4">Create a personal account</h3>
          <Form onSubmit={(evt) => evt.preventDefault()}>
            <div className="form-label-group">
              <input className="input" onChange={(evt) => setName(evt.target.value)} type="text" id="inputName" placeholder="Name" />
            </div>
            <div className="form-label-group">
              <input className="input" onChange={(evt) => setEmail(evt.target.value)} type="email" id="inputEmail" placeholder="Email address" />
            </div>
            <div className="form-label-group">
              <input className="input" onChange={(evt) => setPhoneNum(evt.target.value)} type="phone" id="inputPhone" placeholder="Phone Number" />
            </div>
            <div className="form-label-group flex flex-row">
              <input className="input" ref={passwordRef} onChange={(evt) => setPassword(evt.target.value)} type="password" id="inputPassword" placeholder="Password" />
              <button onClick={togglePassword} style={{ position: 'absolute', marginTop: '12px', right: '0' }} className="bg-white border-white">
                {!passwordVisible && <Image style={{ width: '20px', height: '20px' }} fluid src="/img/eye.svg" alt="password-hidden" />}
                {passwordVisible && <Image style={{ width: '20px', height: '20px' }} fluid src="/img/eye-closed.svg" alt="password-visible" />}
              </button>
            </div>
            <button disabled={loading ? true : false} onClick={handleRegistration} className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2">
              {!loading && <span>Sign up</span>}
              {loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
            </button>
            <div className="text-center pt-3">
              <div>Already have an account? <Link className="font-weight-bold" to="/login">Sign In</Link></div>
            </div>
          </Form>
        </Col>
      </Row>
    </>

  )
}

const seo = {
  metaTitle: 'User Registration | ZeepDash',
  metaDescription: 'Create an account on ZeepDash'
}


export default UserRegistration;
