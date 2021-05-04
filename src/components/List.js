import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Form, Accordion, Button } from 'react-bootstrap';
import PageTitle from './common/PageTitle';
import CardItem from './common/CardItem';
import FailedToFetch from './common/FailedToFetch';
import Seo from './Seo';
import Loading from './common/Loading';
import { FiArrowDown } from 'react-icons/fi';
import { firestore } from '../firebase';
import { capitalize, useQuery, getCuisinesArray } from '../utils';
import { useHistory } from 'react-router';


const List = () => {
	const [restaurants, setRestaurants] = useState(null);
	const [defaultCuisines, setDefaultCuisines] = useState(null);
	const [dataFetchingFailed, setDataFetchingFailed] = useState(false);

	const query = useQuery();
	const cuisinesFilter = query.get("cuisine");

	useEffect(() => {
		const fetchRestaurants = async () => {
			const collectionName = process.env.NODE_ENV === 'production' ? "Restaurants" : "Restaurants_dev";
			let cuisinesArray = [];

			if (cuisinesFilter) {
				cuisinesArray = getCuisinesArray(cuisinesFilter);
			}

			if (cuisinesArray.length > 0) {
				const restaurantsRef = firestore.collection(collectionName)
					.where("cuisines", "array-contains-any", cuisinesArray).limit(20);
				try {
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
					} else {
						setRestaurants([]);
					}
				} catch (error) {
					setDataFetchingFailed(true);
				}
			} else {
				const restaurantsRef = firestore.collection(collectionName).limit(20);
				try {
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
					} else {
						setRestaurants([]);
					}
				} catch (error) {
					setDataFetchingFailed(true);
				}
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

				setDefaultCuisines(cuisines);
			}
		}

		fetchRestaurants();
		fetchCuisines();
	}, [cuisinesFilter]);

	return (
		<>
			<Seo seo={seo} />
			<PageTitle
				title="Offers Near You"
				subTitle="Best deals at your favourite restaurants"
			/>
			{(!restaurants && dataFetchingFailed === true) && <FailedToFetch />}
			{(!restaurants && dataFetchingFailed === false) && <Loading text="Fetching restaurants..." />}
			{(restaurants && restaurants.length >= 0) && <ListContainer defaultCuisines={defaultCuisines} restaurants={restaurants} />}
		</>
	)
}

const ListContainer = ({ restaurants, defaultCuisines }) => {
	return (
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
								<CuisinesFilter defaultCuisines={defaultCuisines} />
							</div>
						</div>
					</Col>
					<Col md={9}>
						{/* <CategoriesCarousel /> */}
						<Row>

							<Restaurants restaurants={restaurants} />
							<Col md={12} className="text-center load-more">
								{/* <Button variant="primary" type="button" disabled=""><Spinner animation="grow" size="sm" className='mr-1' />Loading...</Button> */}
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		</section>
	)
}

const CuisinesFilter = ({ defaultCuisines }) => {
	const query = useQuery();
	const urlCuisines = query.get("cuisine");
	const history = useHistory();
	// set the initial value to cuisines gotten from the url
	let defautlValue = [];
	if (urlCuisines) {
		defautlValue = urlCuisines.split(",");
	}
	const [selectedCuisines, setSelectedCuisines] = useState(defautlValue);

	const setCuisines = (cuisine) => {
		if (!selectedCuisines.includes(cuisine)) {
			let cuisines = selectedCuisines.concat(cuisine);
			setSelectedCuisines(cuisines);
		} else {
			let cuisines = selectedCuisines.filter(item => cuisine !== item);
			setSelectedCuisines(cuisines);
		}
	}


	const filterRestaurants = () => {
		let queryString = selectedCuisines.join(",");
		history.push(`restaurants?cuisine=${queryString}`);
	}

	return (
		<Accordion defaultActiveKey="0">
			<div className="filters-card border-bottom p-4">
				<div className="filters-card-header" id="headingTwo">
					<h6 className="mb-0">
						<Accordion.Toggle as={Button} size='block' variant="link" className='text-left d-flex align-items-center p-0' eventKey="1">
							All cuisines <FiArrowDown className='ml-auto' />
						</Accordion.Toggle>
					</h6>
				</div>
				<Accordion.Collapse eventKey="1">
					<div className="filters-card-body card-shop-filters">
						<div>
							{
								defaultCuisines && defaultCuisines.map((cuisine, index) => <Cuisine key={cuisine.id} selectedCuisines={selectedCuisines} setCuisines={setCuisines} index={index} cuisine={cuisine} />)
							}
						</div>
						<div>
							<Button onClick={filterRestaurants} variant="danger" style={{width: '100%'}} className="mx-auto mt-3">APPLY FILTER</Button>
						</div>
					</div>
				</Accordion.Collapse>
			</div>
		</Accordion>
	)
}

const Cuisine = ({ cuisine, setCuisines, selectedCuisines, index }) => {
	return (
		<Form.Check
			custom
			type='checkbox'
			id={`custom-cb${index + 1}`}
			value={cuisine.name}
			onChange={(evt) => setCuisines(evt.target.value)}
			label={capitalize(cuisine.name)}
			checked={selectedCuisines.includes(cuisine.name) ? true : null}
		/>
	)
}

const Restaurants = ({ restaurants }) => {
	if (restaurants.length < 1) {
		return (
			<div className="h5 text-center mx-auto mt-5">
				No restaurant met your criteria.
			</div>
		)
	}

	return (
		<>
			{
				restaurants && restaurants.map(restaurant => (
					<RestaurantCard key={restaurant.id} restaurant={restaurant} />
				))
			}
		</>
	)
}

const RestaurantCard = ({ restaurant }) => {
	return (
		<Col md={4} sm={6} className="mb-4 pb-2">
			<CardItem
				title={restaurant.name}
				subTitle={restaurant.cuisines.join(" • ").toUpperCase()}
				imageAlt='Product'
				image={restaurant.imageURL ? restaurant.imageURL : '/img/default-list.webp'}
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

const seo = {
	metaTitle: 'Restaurants | ZeepDash',
	metaDescription: 'List of top restaurants near you that serve meals of various cuisines'
}


export default List;
