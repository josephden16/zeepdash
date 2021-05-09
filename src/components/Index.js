import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import TopSearch from './home/TopSearch';
import ProductBox from './home/ProductBox';
import CardItem from './common/CardItem';
import SectionHeading from './common/SectionHeading';
import FontAwesome from './common/FontAwesome';
import Seo from './Seo';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { firestore } from '../firebase';


const seo = {
	metaTitle: 'Home | ZeepDash',
	metaDescription: 'ZeepDash is an awesome website to get meals delivered to you from restaurants near by'
}

const Index = () => {
	const [restaurants, setRestaurants] = useState(null);

	useEffect(() => {
		const fetchRestaurants = async () => {
			const collectionName = process.env.NODE_ENV === 'production' ? 'Restaurants' : 'Restaurants_dev';
			const restaurantRef = collection(firestore, collectionName);
			const restaurantQuery = query(restaurantRef, limit(8));
			const snapshot = await getDocs(restaurantQuery);
			const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setRestaurants(data);
		}
		fetchRestaurants();
	}, []);

	return (
		<>
			<Seo seo={seo} />
			<TopSearch />
			<section className="section pt-5 pb-5 bg-white homepage-add-section">
				<Container>
					<Row>
						<Col md={3} xs={6}>
							<ProductBox
								image='img/products/fried-rice.webp'
								imageClass='img-fluid rounded-lg'
								imageAlt='Fried Rice'
								linkUrl=''
							/>
						</Col>
						<Col md={3} xs={6}>
							<ProductBox
								image='img/products/egusi.webp'
								imageClass='img-fluid rounded-lg'
								imageAlt='Egusi Soup'
								linkUrl=''
							/>
						</Col>
						<Col md={3} xs={6}>
							<ProductBox
								image='img/products/amala.webp'
								imageClass='img-fluid rounded-lg'
								imageAlt='Amala'
								linkUrl=''
							/>
						</Col>
						<Col md={3} xs={6}>
							<ProductBox
								image='img/products/jollof-rice.webp'
								imageClass='img-fluid rounded-lg'
								imageAlt='Jollof Rice'
								linkUrl=''
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
							<RestaurantsCarousel restaurants={restaurants} />
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

const RestaurantsCarousel = ({ restaurants }) => {
	if (!restaurants) return null;

	return (
		<OwlCarousel nav {...options} className="owl-carousel-four owl-theme">
			{!restaurants && null}
			{restaurants && restaurants.map(restaurant => (
				<div key={restaurant.id} className="item">
					<CardItem
						title={restaurant.name}
						subTitle={restaurant.cuisines.join(" • ").toUpperCase()}
						imageAlt={restaurant.name}
						image={restaurant.photoURL || 'img/default-list.webp'}
						imageClass='img-fluid item-img'
						linkUrl={`/restaurant/${restaurant.slug}`}
						offerText=''
						time=''
						price=''
						showPromoted={false}
						promotedVariant='dark'
						favIcoIconColor='text-danger'
						rating=''
					/>
				</div>
			))}
		</OwlCarousel>
	)
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
			items: 3,
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