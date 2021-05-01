import React, { useContext, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Row, Col, Container, Form, Image } from 'react-bootstrap';
import { UserContext } from '../components/providers/AuthProvider';
import firebase from '../firebase';
import { toast } from 'react-toastify';
import { validateEmail } from '../utils';
import Seo from './Seo';


const Login = () => {
	const history = useHistory();
	const user = useContext(UserContext);
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const passwordRef = useRef(null);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [loading, setLoading] = useState(false);

	if ((user && user.role !== "business")) {
		history.replace("/myaccount/orders");
	}

	const signInWithEmailAndPassword = (email, password) => {
		setLoading(true);
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(() => {
				//signed in
				// set persistence to session
				firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
					.then(() => {
						// console.log("Session persistence enabled");
					})
					.catch((error) => {
						// console.log(error.message);
					})
				setLoading(false);
				toast.success("You're signed in");
				history.push("/");
			})
			.catch((error) => {
				setLoading(false);
				var errorCode = error.code;
				// var errorMessage = error.message;
				// console.log(`Error Code: ${errorCode}, Error Message: ${errorMessage}`);
				if (errorCode === "auth/wrong-password") {
					toast.error("The password you entered is incorrect");
				} else if (errorCode === "auth/user-not-found") {
					toast.error("An account does not exist for this email address");
				} else {
					toast.error("Failed to sign in");
				}
			})
	}

	const handleSubmit = (evt) => {
		evt.preventDefault();
		if ((email === '' && password === '')) {
			toast.error("Email and Password cannot be empty");
			return;
		}

		if (!email || !(validateEmail(email))) {
			toast.error("Please enter a valid email address");
			return;
		}

		if (!password) {
			toast.error("Please enter a valid password");
			return;
		}

		signInWithEmailAndPassword(email, password);
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

	// seo
	const seo = {
		metaTitle: 'Log in | ZeepDash',
		metaDescription: 'Log in to your account on ZeepDash'
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
										<h2 className="login-heading mb-4">Welcome back!</h2>
										<Form onSubmit={(evt) => { evt.preventDefault() }}>
											<div className="form-label-group">
												<input className="input" onChange={(evt) => setEmail(evt.target.value)} type="email" id="inputEmail" placeholder="Email" />
											</div>
											<div className="form-label-group flex flex-row">
												<input className="input" ref={passwordRef} onChange={(evt) => setPassword(evt.target.value)} type="password" id="inputPassword" placeholder="Password" />
												<button onClick={togglePassword} style={{ position: 'absolute', marginTop: '12px', right: '0' }} className="bg-white border-white">
													{!passwordVisible && <Image style={{ width: '20px', height: '20px' }} fluid src="/img/eye.svg" alt="password-hidden" />}
													{passwordVisible && <Image style={{ width: '20px', height: '20px' }} fluid src="/img/eye-closed.svg" alt="password-visible" />}
												</button>
											</div>
											<button disabled={loading ? true : false} onClick={handleSubmit} className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2">
												{!loading && <span>Log in</span>}
												{loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
											</button>
											<div className="text-center pt-3">
												Don’t have an account? <Link className="font-weight-bold" to="/register">Sign Up</Link>
											</div>
											<div className="text-center pt-3">
												Forgot your password? <Link className="font-weight-bold" to="/login/reset-password">click here</Link>
											</div>
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
