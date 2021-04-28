import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel3';
import TopSearch from './home/TopSearch';
import ProductBox from './home/ProductBox';
import CardItem from './common/CardItem';
import SectionHeading from './common/SectionHeading';
import FontAwesome from './common/FontAwesome';
import Seo from './Seo';


const seo = {
	metaTitle: 'Home | ZeepDash',
	metaDescription: 'ZeepDash is an awesome website to get meals delivered to you from restaurants near by'
}

class Index extends React.Component {

	render() {
		return (
			<>
				<Seo seo={seo} />
				<TopSearch />
				<section className="section pt-5 pb-5 bg-white homepage-add-section">
					<Container>
						<Row>
							<Col md={3} xs={6}>
								<ProductBox
									image='img/pro1.jpg'
									imageClass='img-fluid rounded'
									imageAlt='product'
									linkUrl='#'
								/>
							</Col>
							<Col md={3} xs={6}>
								<ProductBox
									image='img/2.jpg'
									imageClass='img-fluid rounded'
									imageAlt='product'
									linkUrl='#'
								/>
							</Col>
							<Col md={3} xs={6}>
								<ProductBox
									image='img/pro3.jpg'
									imageClass='img-fluid rounded'
									imageAlt='product'
									linkUrl='#'
								/>
							</Col>
							<Col md={3} xs={6}>
								<ProductBox
									image='img/pro4.jpg'
									imageClass='img-fluid rounded'
									imageAlt='product'
									linkUrl='#'
								/>
							</Col>
						</Row>
					</Container>
				</section>
				<section className="section pt-5 pb-5 products-section">
					<Container>
						<SectionHeading
							heading='Popular Brands'
							subHeading='Top restaurants, cafes'
						/>
						<Row>
							<Col md={12}>
								<OwlCarousel nav loop {...options} className="owl-carousel-four owl-theme">
									<div className="item">
										<CardItem
											title='World Famous'
											subTitle='North Indian • American • Pure veg'
											imageAlt='Product'
											image='img/list/1.png'
											imageClass='img-fluid item-img'
											linkUrl='detail'
											offerText=''
											time=''
											price=''
											showPromoted={false}
											promotedVariant='dark'
											favIcoIconColor='text-danger'
											rating=''
										/>
									</div>
									<div className="item">
										<CardItem
											title='Bite Me Sandwiches'
											subTitle='North Indian • American • Pure veg'
											imageAlt='Product'
											image='img/list/3.png'
											imageClass='img-fluid item-img'
											linkUrl='detail'
											offerText=''
											time=''
											price=''
											showPromoted={false}
											promotedVariant='dark'
											favIcoIconColor='text-danger'
											rating=''
										/>
									</div>
									<div className="item">
										<CardItem
											title='The osahan Restaurant'
											subTitle='North Indian • American • Pure veg'
											imageAlt='Product'
											image='img/list/6.png'
											imageClass='img-fluid item-img'
											linkUrl='detail'
											offerText=''
											time=''
											price=''
											showPromoted={false}
											promotedVariant='danger'
											favIcoIconColor='text-dark'
											rating=''
										/>
									</div>
									<div className="item">
										<CardItem
											title='Polo Lounge'
											subTitle='North Indian • American • Pure veg'
											imageAlt='Product'
											image='img/list/9.png'
											imageClass='img-fluid item-img'
											linkUrl='detail'
											offerText=''
											time=''
											price=''
											showPromoted={false}
											promotedVariant='dark'
											favIcoIconColor='text-danger'
											rating=''
										/>
									</div>
								</OwlCarousel>
							</Col>
						</Row>
					</Container>
				</section>
				<section className="section pt-5 pb-5 bg-white becomemember-section border-bottom">
					<Container>
						<SectionHeading
							heading='Become a Member'
							subHeading='Sign up and get access to excellent meals near you'
						/>
						<Row>
							<Col sm={12} className="text-center">
								<Link to="register" className="btn btn-success btn-lg">
									Create an Account <FontAwesome icon='chevron-circle-right' />
								</Link>
							</Col>
						</Row>
					</Container>
				</section>
			</>
		);
	}
}


const options = {
	responsive: {
		0: {
			items: 1,
		},
		600: {
			items: 2,
		},
		1000: {
			items: 4,
		},
		1200: {
			items: 4,
		},
	},

	lazyLoad: true,
	pagination: false.toString(),
	loop: true,
	dots: false,
	autoPlay: 2000,
	nav: true,
	navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"]
}




export default Index;