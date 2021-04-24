import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { Row, Col, Container, Form, Image } from 'react-bootstrap';
import TimeKeeper from 'react-timekeeper';
import firebase, { firestore } from '../firebase';
import { generateSlug, useQuery, verifyTime } from '../utils';
import { toast } from 'react-toastify';
import Icofont from 'react-icofont';


const Register = () => {
	let query = useQuery();
	let tab = query.get("tab");
	return (
		<>
			<Helmet>
				<title>Registration | ZeepDash</title>
			</Helmet>
			<Container fluid className='bg-white'>
				<Row>
					<Col md={4} lg={6} className="d-none d-lg-flex bg-image"></Col>
					<Col md={8} lg={6}>
						<div className="login d-flex align-items-center py-7">
							<Container>
								{!tab && <UserRegistration className="auth-animation" />}
								{tab && tab === "business" && <BusinessRegsitration className="auth-animation-business" />}
							</Container>
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
}

//TODO: add form validation
const UserRegistration = ({ className }) => {
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [phoneNum, setPhoneNum] = useState("");
	const [billingAddress, setBillingAddress] = useState("");
	const passwordRef = useRef(null);

	const history = useHistory();


	const registerWithEmailAndPassword = (email, password) => {
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in 
				var user = userCredential.user;
				const userRef = firestore.collection("User").doc(user.uid);
				userRef.get()
					.then(snapshot => {
						if (snapshot.exists) {
							toast.warning("User exists with this email address");
						} else {
							firestore.collection("Users").doc(user.uid).set({
								email: user.email,
								role: 'customer',
								phone: phoneNum,
								name: name,
								billingAddress: billingAddress,
								dateJoined: new Date(),
							}).then(() => {
								toast.success("Account created successfully");
								history.push("/");
							})
								.catch(() => {
									toast.error("Failed to create user data");
								})
						}
					})
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log(`Error Code: ${errorCode}, Error Message: ${errorMessage}`);
			});
	}

	const handleRegistration = (evt) => {
		evt.preventDefault();
		registerWithEmailAndPassword(email, password);
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
		<Row>
			<Col md={9} lg={8} className={`mx-auto pl-5 pr-5 ${className}`}>
				<div className="text h4 mb-4 ml-0">
					<Link to="/register" className="text-orange bg-white border-white cursor-pointer">Personal</Link> / <Link to="/register?tab=business" className="text-black border-white bg-white cursor-pointer hover-orange">Business</Link>
				</div>
				<h3 className="login-heading mb-4">Create a personal account</h3>
				<Form onSubmit={(evt) => evt.preventDefault()}>
					<div className="form-label-group">
						<Form.Control className="input" onChange={(evt) => setName(evt.target.value)} type="text" id="inputName" placeholder="Name" />
						<Form.Label htmlFor="inputName">Name</Form.Label>
					</div>
					<div className="form-label-group">
						<Form.Control className="input" onChange={(evt) => setEmail(evt.target.value)} type="email" id="inputEmail" placeholder="Email address" />
						<Form.Label htmlFor="inputEmail">Email address</Form.Label>
					</div>
					<div className="form-label-group">
						<Form.Control className="input" onChange={(evt) => setPhoneNum(evt.target.value)} type="phone" id="inputPhone" placeholder="Phone Number" />
						<Form.Label htmlFor="inputPhone">Phone Number</Form.Label>
					</div>
					<div className="form-label-group">
						<Form.Control className="input" onChange={(evt) => setBillingAddress(evt.target.value)} type="text" id="inputBillingAddress" placeholder="Billing Address" />
						<Form.Label htmlFor="inputBillingAddress">Billing address</Form.Label>
					</div>
					<div className="form-label-group flex flex-row">
						<Form.Control className="input" ref={passwordRef} onChange={(evt) => setPassword(evt.target.value)} type="password" id="inputPassword" placeholder="Password" />
						<Form.Label htmlFor="inputPassword">Password</Form.Label>
						<button onClick={togglePassword} style={{ position: 'absolute', marginTop: '12px', right: '0' }} className="bg-white border-white">
							{!passwordVisible && <Image style={{ width: '20px', height: '20px' }} fluid src="/img/eye.svg" alt="password-hidden" />}
							{passwordVisible && <Image style={{ width: '20px', height: '20px' }} fluid src="/img/eye-closed.svg" alt="password-visible" />}
						</button>
					</div>
					<button onClick={handleRegistration} className="btn btn-lg btn-outline-primary btn-block btn-login text-uppercase font-weight-bold mb-2">Sign Up</button>
					<div className="text-center pt-3">
						<div>Already have an account? <Link className="font-weight-bold" to="/login">Sign In</Link></div>
					</div>
				</Form>
			</Col>
		</Row>
	)
}

// TODO: add proper form validation
const BusinessRegsitration = ({ className }) => {
	const [openingTime, setOpeningTime] = useState("9:00");
	const [closingTime, setClosingTime] = useState("18:00");

	const [showOpeningTime, setShowOpeningTime] = useState(false);
	const [showClosingTime, setShowClosingTime] = useState(false);

	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [phoneNum, setPhoneNum] = useState("");
	const [address, setAdress] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const areaCode = "+234";
	const passwordRef = useRef(null);
	const history = useHistory();

	const handleSubmit = (evt) => {
		evt.preventDefault();
	}

	const formatPhoneNumber = (phoneNumber) => {
		if (phoneNumber.startsWith("+234")) {
			let phoneNum = phoneNumber.replace("+234", "");
			return phoneNum;
		}
		return phoneNumber;
	}

	const validateFormData = () => {
		if (!(name && email && phoneNum && address && password)) {
			toast.warning("Please fill all form fields");
			return;
		}

		if (!name) {
			toast.warning("Enter a valid name");
			return;
		}

		if (!email) {
			toast.warning("Enter a valid email");
			return;
		}

		if (!phoneNum || phoneNum.length < 11) {
			toast.warning("Enter a valid phone number");
			return;
		}

		if (!address) {
			toast.warning("Enter a valid address");
			return;
		}

		if (!password) {
			toast.warning("Enter a valid password");
			return;
		}

		const isOpeningAndClosingTimeCorrect = verifyTime(openingTime, closingTime);

		if (!isOpeningAndClosingTimeCorrect) {
			toast.warning("Opening time cannot be ahead of closing time");
			return;
		}

		return true;
	}

	const registerBusinessAccountWithEmailAndPassword = (email, password) => {
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in 
				const { user } = userCredential;
				const userRef = firestore.collection("Restaurants").doc(user.uid);
				userRef.get()
					.then(snapshot => {
						if (snapshot.exists) {
							toast.warning("A business with these details exist");
						} else {
							firestore.collection("Restaurants").doc(user.uid).set({
								email: user.email,
								role: 'business',
								phone: `${areaCode}${phoneNum}`,
								name: name,
								address: address,
								dateJoined: new Date(),
								openingTime: openingTime,
								closingTime: closingTime,
								cuisines: ['african', 'international'],
								photoURL: '',
								bannerImageURL: '',
								slug: generateSlug(name)
							})
								.then(() => {
									firestore.collection("Users").doc(user.uid).set({
										email: user.email,
										role: 'business',
										phone: phoneNum,
										name: name,
										address: address,
										dateJoined: new Date(),
									})
										.then(() => {
											toast.success("Business account created successfully");
											history.push("/myrestaurant/meals");
											window.location.reload();
										})
								})
								.catch(() => {
									toast.error("Failed to create business account");
								})
						}
					})
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				toast.error("Failed to register your business account");
				console.log(`Error Code: ${errorCode}, Error Message: ${errorMessage}`);
			});
	}

	const handleRegistration = () => {
		const isFormValid = validateFormData();
		if (isFormValid) {
			registerBusinessAccountWithEmailAndPassword(email, password);
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
		<Row className="mt-3 mb-2">
			<Col md={9} lg={8} className={`mx-auto pl-5 pr-5 ${className}`}>
				<div className="text h4 mb-3">
					<Link to="/register" className="text-black hover-orange padding-0 bg-white border-white cursor-pointer">Personal</Link> / <Link to="/register?tab=business" className="cursor-pointer hover-orange bg-white border-white cursor-pointer">Business</Link>
				</div>
				<h3 className="login-heading mb-3">Create a business account</h3>
				<Form onSubmit={handleSubmit}>
					<div className="form-label-group">
						<Form.Control className="input" onChange={(evt) => setName(evt.target.value)} type="text" id="inputName" placeholder="Name" />
						<Form.Label htmlFor="inputName">Business Name</Form.Label>
					</div>
					<div className="form-label-group">
						<Form.Control className="input" onChange={(evt) => setEmail(evt.target.value)} type="email" id="inputEmail" placeholder="Email address" />
						<Form.Label htmlFor="inputEmail">Email address</Form.Label>
					</div>
					<div className="form-label-group">
						<Form.Control className="input" onChange={(evt) => setPhoneNum(formatPhoneNumber(evt.target.value))} type="text" id="inputPhone" placeholder="Phone" />
						<Form.Label htmlFor="inputPhone">Phone Number</Form.Label>
					</div>
					<div className="form-label-group">
						<Form.Control className="input" onChange={(evt) => setAdress(evt.target.value)} type="text" id="inputAddress" placeholder="Address" />
						<Form.Label htmlFor="inputAddress">Address</Form.Label>
					</div>
					<div className="form-label-group flex flex-row">
						<Form.Control className="input" ref={passwordRef} onChange={(evt) => setPassword(evt.target.value)} type="password" id="inputPassword" placeholder="Password" />
						<Form.Label htmlFor="inputPassword">Password</Form.Label>
						<button onClick={togglePassword} style={{ position: 'absolute', marginTop: '12px', right: '0' }} className="bg-white border-white">
							{!passwordVisible && <Image style={{ width: '20px', height: '20px' }} fluid src="/img/eye.svg" alt="password-hidden" />}
							{passwordVisible && <Image style={{ width: '20px', height: '20px' }} fluid src="/img/eye-closed.svg" alt="password-visible" />}
						</button>
					</div>
					<div className="form-label-group">
						<div>
							<button className="time-select-button" onClick={() => {
								setShowOpeningTime(!showOpeningTime);
								setShowClosingTime(false);
							}}><span className='mr-2'><Icofont icon="clock-time" /></span>Opening Time: {openingTime}</button>
							<div className="time-picker">
								{showOpeningTime &&
									<TimeKeeper
										onChange={(newTime) => setOpeningTime(newTime.formatted24)}
										doneButton={() => (
											<button
												style={{ textAlign: 'center', padding: '10px 0', width: '100%', border: 'none', 'fontSize': '16px', 'fontWeight': 'bold', 'color': '#8C8C8C' }}
												onClick={() => setShowOpeningTime(false)}
												className="cursor-pointer"
											>
												Done
											</button>
										)}
									/>}
							</div>
							{/* <span className="ml-2">Opening Time: {openingTime}</span> */}
						</div>
					</div>
					<div className="form-label-group">
						<div>
							<button className="time-select-button" onClick={() => {
								setShowClosingTime(!showClosingTime);
								setShowOpeningTime(false);
							}}><span className='mr-2'><Icofont icon="clock-time" /></span>Closing Time: {closingTime}</button>
							<div className="time-picker">
								{showClosingTime &&
									<TimeKeeper
										onChange={(newTime) => setClosingTime(newTime.formatted24)}
										doneButton={() => (
											<button
												style={{ textAlign: 'center', padding: '10px 0', width: '100%', border: 'none', 'fontSize': '16px', 'fontWeight': 'bold', 'color': '#8C8C8C' }}
												onClick={() => setShowClosingTime(false)}
												className="cursor-pointer"
											>
												Done
											</button>
										)}
									/>
								}
							</div>
							{/* <span className="ml-2">Closing Time: {closingTime}</span> */}
						</div>
					</div>
					<button onClick={handleRegistration} className="btn btn-lg btn-outline-primary btn-block btn-login text-uppercase font-weight-bold mb-2">Sign Up</button>
					<div className="text-center pt-3">
						Already have an account? <Link className="font-weight-bold" to="/login">Sign In</Link>
					</div>
				</Form>
			</Col>
		</Row>
	)
}

export default Register;
