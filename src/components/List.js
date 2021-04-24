import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Accordion, Button, Form } from 'react-bootstrap';
import Icofont from 'react-icofont';
import PageTitle from './common/PageTitle';
import CardItem from './common/CardItem';
import { firestore } from '../firebase';
import { capitalize } from '../utils';


const List = () => {
	const [restaurants, setRestaurants] = useState(null);
	const [cuisines, setCuisines] = useState(null);


	useEffect(() => {
		const fetchRestaurants = async () => {
			const restaurantsRef = firestore.collection("Restaurants").limit(10);
			const snapshot = await restaurantsRef.get();

			if (!snapshot.empty) {
				const restaurants = snapshot.docs.map(doc => {
					let data = doc.data();
					return (
						{
							id: doc.id,
							imageURL: data.photoURL,
							name: data.name,
							cuisines: data.cuisines,
							slug: data.slug
						}
					)
				});

				setRestaurants(restaurants);
			}
		}

		const fetchCuisines = async () => {
			const cuisinesRef = firestore.collection("Cuisines");

			const snapshot = await cuisinesRef.get();

			if (!snapshot.empty) {
				const cuisines = snapshot.docs.map(doc => (
					{
						id: doc.id,
						name: doc.data().name
					}
				));

				setCuisines(cuisines);
			}

		}

		fetchRestaurants();
		fetchCuisines();
	}, []);

	return (
		<>
			<PageTitle
				title="Offers Near You"
				subTitle="Best deals at your favourite restaurants"
			/>
			<section className="section pt-5 pb-5 products-listing">
				<Container>
					<Row className="d-none-m">
						<Col md={12}>
							{/* TODO: add this feature later */}
							{/* <h4 className="font-weight-bold mt-0 mb-3">OFFERS <small className="h6 mb-0 ml-2">299 restaurants</small></h4> */}
						</Col>
					</Row>
					<Row>
						<Col md={3}>
							<div className="filters shadow-sm rounded bg-white mb-4">
								<div className="filters-header border-bottom pl-4 pr-4 pt-3 pb-3">
									<h5 className="m-0">Filter By</h5>
								</div>
								<div className="filters-body">
									<CuisinesFilter cuisines={cuisines} />
								</div>
							</div>
						</Col>
						<Col md={9}>
							{/* <CategoriesCarousel /> */}
							<Row>
								{
									restaurants && restaurants.map(restaurant => (
										<RestaurantCard key={restaurant.id} restaurant={restaurant} />
									))
								}
								<Col md={12} className="text-center load-more">
									{/* <Button variant="primary" type="button" disabled=""><Spinner animation="grow" size="sm" className='mr-1' />Loading...</Button> */}
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
			</section>
		</>
	)
}


const CuisinesFilter = ({ cuisines }) => {
	return (
		<Accordion defaultActiveKey="0">
			<div className="filters-card border-bottom p-4">
				<div className="filters-card-header" id="headingTwo">
					<h6 className="mb-0">
						<Accordion.Toggle as={Button} size='block' variant="link" className='text-left d-flex align-items-center p-0' eventKey="1">
							All cuisines <Icofont icon='arrow-down' className='ml-auto' />
						</Accordion.Toggle>
					</h6>
				</div>
				<Accordion.Collapse eventKey="1">
					<div className="filters-card-body card-shop-filters">
						{
							cuisines && cuisines.map(cuisine => <Cuisine key={cuisine.id} cuisine={cuisine} />)
						}
					</div>
				</Accordion.Collapse>
			</div>
		</Accordion>
	)
}

const Cuisine = ({ cuisine }) => {
	return (
		<Form.Check
			custom
			type='checkbox'
			id='custom-cb6'
			value={cuisine.name}
			onChange={(evt) => console.log(evt.target.value)}
			label={capitalize(cuisine.name)}
		/>
	)
}

const RestaurantCard = ({ restaurant }) => {
	return (
		<Col md={4} sm={6} className="mb-4 pb-2">
			<CardItem
				title={restaurant.name}
				subTitle={restaurant.cuisines.join(" • ").toUpperCase()}
				imageAlt='Product'
				image={restaurant.imageURL ? restaurant.imageURL : '/img/list/1.png'}
				imageClass='img-fluid item-img'
				linkUrl={`restaurant/${restaurant.slug}`}
				offerText=''
				time=''
				price=''
				showPromoted={false}
				promotedVariant='dark'
				favIcoIconColor='text-danger'
				rating=''
			/>
		</Col>
	)
}


export default List;