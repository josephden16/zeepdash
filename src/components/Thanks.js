import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Image } from 'react-bootstrap';

class Thanks extends React.Component {

	render() {
		return (
			<section className="section pt-5 pb-5 osahan-not-found-page">
				<Container>
					<Row>
						<Col md={12} className="text-center pt-5 pb-5">
							<Image className="img-fluid" style={{width: '170px'}} src="/img/thanks.png" alt="404" />
							<h4 className="mt-2 mb-4">Your order has been placed successfully</h4>
							<Link className="btn btn-primary btn-lg" to="/myaccount/orders">GO HOME</Link>
						</Col>
					</Row>
				</Container>
			</section>
		);
	}
}


export default Thanks;