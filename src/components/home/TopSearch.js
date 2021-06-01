import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import CuisinesCarousel from '../common/CuisinesCarousel';

class TopSearch extends React.Component {

	render() {
		return (
			<section className="pt-5 pb-5 homepage-search-block position-relative">
				<div className="banner-overlay"></div>
				<Container>
					<Row className="d-flex align-items-center">
						<Col md={8}>
							<div className="homepage-search-title">
								<h1 className="mb-4 font-weight-normal"><span className="font-weight-bold">Find awesome meals</span> in Ibadan.</h1>
								<p style={{ fontSize: '17px' }} className="mb-5 text-dark font-weight-normal">Lists of top restaurants, cafes, pubs, and bars in Ibadan.</p>
							</div>
							{/* <div className="homepage-search-form">
								<Form className="form-noborder">
									<div className="form-row">
										{/* <Form.Group className='col-lg-3 col-md-3 col-sm-12'>
											<div className="location-dropdown">
												<Icofont icon='location-arrow' />
												<Select2 className="custom-select"
													data={[
														{ text: 'Breakfast', id: 1 },
														{ text: 'Lunch', id: 2 },
														{ text: 'Dinner', id: 3 },
														{ text: 'Cafés', id: 4 },
														{ text: 'Delivery', id: 5 }
													]}
													options={{
														placeholder: 'Quick Searches',
													}}
												/>
											</div>
										</Form.Group> 
										<Form.Group className='col-lg-7 col-md-7 col-sm-12'>
											<Form.Control type="text" placeholder="Enter your delivery location" size='lg' />
											<Link className="locate-me" to="#"><Icofont icon='ui-pointer' /> Locate Me</Link>
										</Form.Group>
										<Form.Group className='col-lg-2 col-md-2 col-sm-12'>
											<Link to="restaurants" className="btn btn-primary btn-block btn-lg btn-gradient">Search</Link>
										</Form.Group>
									</div>
								</Form>
							</div>
							<h6 className="mt-4 text-shadow font-weight-normal">E.g. Beverages, Pizzas, Chinese, Bakery, Indian...</h6> */}
							<CuisinesCarousel />
						</Col>
					</Row>
				</Container>
			</section>
		);
	}
}

export default TopSearch;