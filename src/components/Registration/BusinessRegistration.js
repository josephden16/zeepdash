import React, { useState, useRef, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Row, Col, Form, Image } from 'react-bootstrap';
import Seo from '../Seo';
import TimeKeeper from 'react-timekeeper';
import { generateSlug, validateEmail, validateName, validatePassword, validatePhoneNumber, verifyTime, formatPhoneNumber } from '../../utils';
import { toast } from 'react-toastify';
import { FiClock } from 'react-icons/fi';
import { UserContext } from '../providers/AuthProvider';
import { doc, setDoc } from '@firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, firestore } from '../../firebase';


const BusinessRegsitration = ({ className }) => {
	const user = useContext(UserContext);
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
	const [loading, setLoading] = useState(false);
	const passwordRef = useRef(null);
	const history = useHistory();

	const handleSubmit = (evt) => {
		evt.preventDefault();
	}

	const registerBusinessAccountWithEmailAndPassword = (email, password) => {
		setLoading(true);
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in 
				const { user } = userCredential;
				const restaurantCollectionName = process.env.NODE_ENV === 'production' ? 'Restaurants' : 'Restaurants_dev';
				const usersCollectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
				const phonenumber = formatPhoneNumber(phoneNum);
				const restaurantRef = doc(firestore, restaurantCollectionName, user.uid);
				setDoc(restaurantRef, {
					email: user.email,
					role: 'business',
					phone: phonenumber,
					name: name,
					address: address,
					dateJoined: new Date(),
					openingTime: openingTime,
					closingTime: closingTime,
					cuisines: ['african'],
					photoURL: '',
					backgroundImageURL: '',
					available: false,
					slug: generateSlug(name)
				})
					.then(() => {
						const userRef = doc(firestore, usersCollectionName, user.uid);
						setDoc(userRef, {
							email: user.email,
							role: 'business',
							phone: phonenumber,
							name: name,
							address: address,
							dateJoined: new Date(),
						})
							.then(() => {
								setLoading(false);
								history.push("/");
								toast.success("Business account created successfully");
							})
							.catch(() => {
								setLoading(false);
								toast.error("Failed to register your business account");
							})
					})
					.catch(() => {
						setLoading(false);
						toast.error("Failed to register your buisness account");
					})
			})
			.catch((error) => {
				setLoading(false);
				// console.log(error.message);
				if (error.code === "auth/email-already-in-use") {
					toast.error("This email address is taken please create a new one.");
					return;
				} else {
					toast.error("Failed to register your business account");
					return;
				}
			})
	}

	const validateFormData = () => {
		if (!(name && email && phoneNum && address && password)) {
			toast.warning("Please fill all form fields");
			return;
		}

		if (!name || !validateName(name)) {
			toast.warning("Enter a valid name");
			return;
		}

		if (!email || !validateEmail(email)) {
			toast.warning("Enter a valid email");
			return;
		}

		if (!phoneNum || !validatePhoneNumber(phoneNum)) {
			toast.warning("Enter a valid phone number");
			return;
		}

		if (!address) {
			toast.warning("Enter a valid address");
			return;
		}

		if (!password || !validatePassword(password)) {
			toast.error("Please enter a valid password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter");
			return;
		}

		const isOpeningAndClosingTimeCorrect = verifyTime(openingTime, closingTime);

		if (!isOpeningAndClosingTimeCorrect) {
			toast.warning("Opening time cannot be ahead of closing time");
			return;
		}

		return true;
	}

	const handleRegistration = () => {
		const isFormValid = validateFormData();
		if (isFormValid) {
			// sign out the user is already signed in
			if (user) {
				signOut(auth).then(() => {
					registerBusinessAccountWithEmailAndPassword(email, password);
				})
			} else {
				registerBusinessAccountWithEmailAndPassword(email, password);
			}
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

	const seo = {
		metaTitle: 'Business Registration | ZeepDash',
		metaDescription: 'Register your restaurant on ZeepDash'
	}

	return (
		<>
			<Seo seo={seo} />
			<Row className="mt-3 mb-2">
				<Col md={9} lg={8} className={`mx-auto pl-5 pr-5 ${className}`}>
					<div className="text h4 mb-3">
						<Link to="/register" className="text-black hover-orange padding-0 bg-white border-white cursor-pointer">Personal</Link> / <Link to="/register?tab=business" className="cursor-pointer hover-orange bg-white border-white cursor-pointer">Business</Link>
					</div>
					<h3 className="login-heading mb-3">Create a business account</h3>
					<Form onSubmit={handleSubmit}>
						<div className="form-label-group">
							<input className="input" onChange={(evt) => setName(evt.target.value)} type="text" id="inputName" placeholder="Name" />
						</div>
						<div className="form-label-group">
							<input className="input" onChange={(evt) => setEmail(evt.target.value)} type="email" id="inputEmail" placeholder="Email" />
						</div>
						<div className="form-label-group">
							<input className="input" onChange={(evt) => setPhoneNum(evt.target.value)} type="text" id="inputPhone" placeholder="Phone" />
						</div>
						<div className="form-label-group">
							<input className="input" onChange={(evt) => setAdress(evt.target.value)} type="text" id="inputAddress" placeholder="Address" />
						</div>
						<div className="form-label-group flex flex-row">
							<input className="input" ref={passwordRef} onChange={(evt) => setPassword(evt.target.value)} type="password" id="inputPassword" placeholder="Password" />
							<button onClick={togglePassword} style={{ position: 'absolute', marginTop: '12px', right: '0' }} className="bg-white border-white">
								{!passwordVisible && <Image style={{ width: '20px', height: '20px' }} fluid src="/img/eye.svg" alt="password-hidden" />}
								{passwordVisible && <Image style={{ width: '20px', height: '20px' }} fluid src="/img/eye-closed.svg" alt="password-visible" />}
							</button>
						</div>
						<div className="form-label-group">
							<div className="flex flex-row items-center">
								<div>
									<button className="time-select-button" onClick={() => {
										setShowOpeningTime(!showOpeningTime);
										setShowClosingTime(false);
									}}><span className='mr-2'>	<FiClock /></span>Opening Time: {openingTime}</button>
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
								</div>
								<div style={{ fontSize: '20px', color: 'black' }} className="ml-1 mr-1">-</div>
								<div>
									<button className="time-select-button" onClick={() => {
										setShowClosingTime(!showClosingTime);
										setShowOpeningTime(false);
									}}><span className='mr-2'>	<FiClock className="ml-2" /></span>Closing Time: {closingTime}</button>
									<div className="time-picker closing-time">
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
								</div>
							</div>
						</div>
						<button disabled={loading ? true : false} onClick={handleRegistration} className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2">
							{!loading && <span>Sign up</span>}
							{loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
						</button>
						<div className="text-center pt-3">
							Already have an account? <Link className="font-weight-bold" to="/login">Sign In</Link>
						</div>
					</Form>
				</Col>
			</Row>
		</>
	)
}


export default BusinessRegsitration;
