import React from 'react';
import {Link} from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import UserRegistration from "./Registration/UserRegistration";
import BusinessRegsitration from "./Registration/BusinessRegistration";
import Seo from './Seo';
import { useQuery } from '../utils';



const Register = () => {
	let query = useQuery();
	let tab = query.get("tab");
	const seo = {
		metaTitle: 'Register | ZeepDash',
		metaDescription: 'Create an account on ZeepDash'
	}
	return (
		<>
			<Seo seo={seo} />
			<Container fluid className='bg-white'>
				<Row>
					<Col md={4} lg={6} className="d-none d-lg-flex bg-login-image"></Col>
					<Col md={8} lg={6}>
						<div className="login d-flex align-items-center py-7">
							<Container>
								{!tab && <UserRegistration className="auth-animation" />}
								{tab && tab === "business" && <BusinessRegsitration className="auth-animation-business" />}
								<div className="text-center mt-4">Return to <Link to="/">home page</Link></div>
							</Container>
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Register;
