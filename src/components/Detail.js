import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col, Container, Tab, Nav, Image, Badge, Button } from 'react-bootstrap';
import Seo from './Seo';
import NotFound from './NotFound';
import Loading from './common/Loading';
import GalleryCarousel from './common/GalleryCarousel';
import CheckoutItem from './common/CheckoutItem';
import BestSeller from './common/BestSeller';
import { FiNavigation, FiCheckCircle } from 'react-icons/fi';
import { HiClock, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { IoFastFood } from 'react-icons/io5';
import { CgArrowLongRight } from 'react-icons/cg';
import { BsClockFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { firestore } from '../firebase';
import { capitalize, getTotalAmount, isRestaurantOpen, MAX, MIN, updateCartSession, updateFirestoreCart } from '../utils';
import { UserContext } from './providers/AuthProvider';
// import ItemsCarousel from './common/ItemsCarousel';
// import QuickBite from './common/QuickBite';


const Detail = () => {
	const [restaurant, setRestaurant] = useState(null);
	const [restaurantOffers, setRestaurantOffers] = useState(null);
	const [cart, setCart] = useState(null);
	const [loading, setLoading] = useState(false);
	const [notFound, setNotFound] = useState(false);

	const { slug } = useParams();
	useEffect(() => {
		const collectionName = process.env.NODE_ENV === 'production' ? 'Restaurants' : 'Restaurants_dev';
		const restaurantRef = firestore.collection(collectionName)
			.where("slug", "==", slug);

		const mealsCollectionName = process.env.NODE_ENV === 'production' ? 'Meals' : 'Meals_dev';
		const offersRef = firestore.collection(mealsCollectionName)
			.where("restaurantSlug", "==", slug);

		const fetchRestaurantData = async () => {
			setLoading(true);

			try {
				const restaurantSnapshot = await restaurantRef.get();

				if (!restaurantSnapshot.empty) {
					// fetch restaurant data
					const data = restaurantSnapshot.docs.map(doc => {
						return (
							{
								id: doc.id,
								...doc.data()
							}
						)
					})[0];

					// get cart session data
					const restaurantId = data.id;
					let cart = JSON.parse(sessionStorage.getItem(restaurantId));
					// update state
					setCart(cart);
					setRestaurant(data);
					setLoading(false);
				} else {
					setLoading(false);
					setNotFound(true);
				}
			} catch (error) {
				setLoading(false);
				setNotFound(true);
				toast.error("Failed to fetch restaurant data");
				console.log(error.message);
			}
		}

		const fetchRestaurantOffers = async () => {
			try {
				const offersSnapshot = await offersRef.get();
				if (!offersSnapshot.empty) {
					const offers = offersSnapshot.docs.map(doc => {
						return (
							{
								id: doc.id,
								...doc.data()
							}
						)
					});
					setRestaurantOffers(offers);
				}
			} catch (error) {
				toast.error("Failed to fetch offers");
			}
		}

		fetchRestaurantData();
		fetchRestaurantOffers();

	}, [slug]);


	if (!slug) {
		return <NotFound />
	}

	if (loading && notFound === false) return <Loading text='Fetching restaurant data...' />

	if (notFound) return <NotFound />

	if (!restaurant) {
		return null;
	}


	const seo = {
		metaTitle: `${restaurant.name}` || '',
		metaDescription: `Welcome to the page of ${restaurant.name} on ZeepDash...` || ''
	}

	return (
		<>
			<Seo seo={seo} />
			<section className="restaurant-detailed-banner">
				<div className="text-center">
					<Image fluid className="cover" draggable={false} alt={restaurant.name} style={{ width: '100%', objectFit: 'fill' }} src={restaurant.backgroundImageURL || '/img/restaurant-bg.webp'} />
				</div>
				<div className="restaurant-detailed-header">
					<Container>
						<Row className="d-flex align-items-end">
							<Col md={8}>
								<div className="restaurant-detailed-header-left">
									<Image draggable={false} fluid className="mr-3 float-left" alt="osahan" src={restaurant.photoURL || '/img/default-list.png'} />
									<h2 className="text-white">{restaurant.name}</h2>
									<p className="text-white mb-1"><FiNavigation /> {" "}{restaurant.address.toUpperCase()} <RestaurantOpenStatus openingTime={restaurant.openingTime} closingTime={restaurant.closingTime} />
									</p>
									<p className="text-white mb-0"><IoFastFood />{" "}{restaurant.cuisines.join(" , ").toUpperCase()}</p>
								</div>
							</Col>
							<Col md={4}>
								<div className="restaurant-detailed-header-right text-right mt-2">
									{/* TODO: ADD DELIVERY TIME FEATURE LATER*/}
									<Button variant='secondary' style={{ fontSize: '14px' }} type="button"><BsClockFill style={{ marginRight: '3px' }} /> <span>{restaurant.openingTime} - {restaurant.closingTime}</span></Button>
									{/* <h6 className="text-white mb-0 restaurant-detailed-ratings">
										<span className="generator-bg rounded text-white">
											<Icofont icon="star" /> 3.1
										</span> 23 Ratings
										<Icofont icon="speech-comments" className="ml-3" /> 91 reviews
									</h6> */}
								</div>
							</Col>
						</Row>
					</Container>
				</div>
			</section>
			<Tab.Container defaultActiveKey="first">
				<section className="offer-dedicated-nav bg-white border-top-0 shadow-sm">
					<Container>
						<Row>
							<Col md={12}>
								{/*TODO: add this feature later  */}
								{/* <span className="restaurant-detailed-action-btn float-right">
									<Button variant='light' size='sm' className="border-light-btn mr-1" type="button"><Icofont icon="heart" className='text-danger' /> Mark as Favourite</Button>
									<Button variant='outline-danger' size='sm' type="button"><Icofont icon="sale-discount" />  OFFERS</Button>
								</span> */}
								<Nav id="pills-tab">
									<Nav.Item>
										<Nav.Link eventKey="first">Order Online</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="third">Restaurant Info</Nav.Link>
									</Nav.Item>
									{/* <Nav.Item>
										<Nav.Link eventKey="fifth">Ratings & Reviews</Nav.Link>
									</Nav.Item> */}
								</Nav>
							</Col>
						</Row>
					</Container>
				</section>
				<section className="offer-dedicated-body pt-2 pb-2 mt-4 mb-4">
					<Container>
						<Row>
							<Col md={8}>
								<div className="offer-dedicated-body-left">
									<Tab.Content className='h-100'>
										<Tab.Pane eventKey="first">
											{/* <h3 className="mb-3">Our offers</h3> */}
											{/* <ItemsCarousel meals={restaurantOffers} /> */}
											<BestSellerContainer updateCart={setCart} restaurantOffers={restaurantOffers} restaurant={restaurant} />
										</Tab.Pane>
										<Tab.Pane eventKey="second">
											<div className='position-relative'>
												<GalleryCarousel />
											</div>
										</Tab.Pane>
										<RestaurantInfoTab restaurant={restaurant} />
									</Tab.Content>
								</div>
							</Col>
							<Cart restaurant={restaurant} updateCart={setCart} cart={cart} />
						</Row>
					</Container>
				</section>
			</Tab.Container>
		</>
	);
}

const BestSellerContainer = ({ restaurantOffers, restaurant, updateCart }) => {
	if (!restaurantOffers) return null;

	return (
		<Row>
			<h3 className="mb-4 mt-3 col-md-12">Our meals</h3>
			{restaurantOffers && restaurantOffers.map(offer => (
				<Meal key={offer.id} updateCart={updateCart} offer={offer} restaurant={restaurant} />
			))}
		</Row>
	)
}

const RestaurantOpenStatus = ({ openingTime, closingTime }) => {
	const restaurantOpen = isRestaurantOpen(openingTime, closingTime);
	if (restaurantOpen) {
		return (
			<Badge variant="success" className="p-1 ml-1">OPEN</Badge>
		)
	}
	return (
		<Badge variant="danger" className="p-1 ml-1">CLOSED</Badge>
	)
}

const Meal = ({ offer, restaurant, updateCart }) => {
	let subTitle = restaurant.cuisines.join(" • ").toUpperCase();
	return (
		<Col md={4} sm={6} className="mb-4">
			<BestSeller
				id={offer.id}
				title={offer.name}
				subTitle={subTitle}
				imageAlt={offer.name}
				image={offer.imageURL}
				imageClass='img-fluid item-img offer-img'
				price={offer.price}
				priceUnit='&#8358;'
				isNew={false}
				showPromoted={false}
				promotedVariant='dark'
				favIcoIconColor='text-danger'
				rating=''
				updateCart={updateCart}
				restaurantId={restaurant.id}
				openingTime={restaurant.openingTime}
				closingTime={restaurant.closingTime}
			/>
		</Col>
	)
}

const RestaurantInfoTab = ({ restaurant }) => {
	return (
		<Tab.Pane eventKey="third">
			<div id="restaurant-info" className="bg-white rounded shadow-sm p-4 mb-4">
				<div className="address-map float-right ml-5">
					<div className="mapouter">
						{/* <div className="gmap_canvas">
							<iframe title='addressMap' width="300" height="170" id="gmap_canvas" src="https://maps.google.com/maps?q=university%20of%20san%20francisco&t=&z=9&ie=UTF8&iwloc=&output=embed" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
						</div> */}
					</div>
				</div>
				<h5 className="mb-4">Restaurant Info</h5>
				<p className="mb-2 text-black"><HiLocationMarker className="text-red mr-2" />{restaurant.address}</p>
				<p className="mb-2 text-black"><HiPhone className="text-red mr-2" />{restaurant.phone}</p>
				<p className="mb-2 text-black"><HiMail className="email text-red text-primary mr-2" />{restaurant.email}</p>
				<p className="mb-2 text-black"><HiClock className="clock-time text-red text-primary mr-2" /> <span className="mr-1">Today {restaurant.openingTime} - {restaurant.closingTime}</span>   <RestaurantOpenStatus openingTime={restaurant.openingTime} closingTime={restaurant.closingTime} /></p>
				{/* <hr className="clearfix" />
				<p className="text-black mb-0">You can also check the 3D view by using our menue map clicking here &nbsp;&nbsp;&nbsp; <Link className="text-info font-weight-bold" to="#">Venue Map</Link></p>
				<hr className="clearfix" /> */}
				<h5 className="mt-4 mb-4">More Info</h5>
				{/* TODO: add food offered by the restaurants here	 */}
				{/* <p className="mb-3">Dal Makhani, Panneer Butter Masala, Kadhai Paneer, Raita, Veg Thali, Laccha Paratha, Butter Naan</p> */}
				<div className="border-btn-main mb-4">
					{
						restaurant.cuisines && restaurant.cuisines.map((cuisine, index) => <CuisineOffered key={index} cuisine={cuisine} />)
					}
				</div>
			</div>
		</Tab.Pane>
	)
}

const Cart = ({ cart, updateCart, restaurant }) => {
	const user = useContext(UserContext);
	const restaurantId = restaurant.id;
	let total = cart ? getTotalAmount(cart) : 0;
	const history = useHistory();

	useEffect(() => {
		const fetchCart = async () => {
			if (!user) return null;

			let sessionCart = JSON.parse(sessionStorage.getItem(restaurantId));
			// checks if the cart exists in the session 
			if (sessionCart) return;

			// pull the cart data from firestore
			const collectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
			const cartRef = firestore.collection(collectionName).doc(user.id).collection("Cart").doc(restaurantId);

			const snapshot = await cartRef.get();

			if (snapshot.exists) {
				const data = snapshot.data();
				let { cart } = data;
				updateCart(cart);
				updateCartSession(restaurantId, cart);
			}

		}

		fetchCart();
	}, [restaurantId, updateCart, user])

	const handleCheckout = () => {
		if (!user) {
			toast.error("You must be signed in to checkout");
			history.replace(`/login?next=${window.location.pathname}`);
		} else {
			// send cart data to firestore
			try {
				updateFirestoreCart(cart, user, restaurantId);
				history.push(`/checkout/${restaurantId}`);
			} catch (error) {
				toast.error("Checkout failed");
			}
		}
	}

	return (
		<Col md={4}>
			<div className="generator-bg rounded shadow-sm mb-4 p-4 osahan-cart-item">

				<div>
					{
						(!cart || cart.length < 1) &&
						<div className="mt-2" style={{ display: 'flex', flexFlow: 'column nowrap' }}>
							<Image draggable={false} src="/img/empty-cart.svg" alt="empty-cart" fluid style={{ width: '20%', margin: 'auto' }} />
							<p style={{ fontSize: '15px' }} className="text-center text-white mt-2">Your cart is empty. Add meals to your cart.</p>
						</div>
					}
					{(cart && cart.length > 0) &&
						<div>
							<h5 className="mb-2 text-white">Your Order</h5>
							<p className="mb-4 text-white">{cart.length} Items</p>
							<div className="bg-white rounded shadow-sm mb-2">
								{cart.map((meal) => <OrderItem restaurantId={restaurantId} updateCart={updateCart} key={meal.id} meal={meal} />)}
							</div>
							<div className="mb-2 bg-white rounded p-2 clearfix">
								<Image fluid className="float-left" src="/img/wallet-icon.png" />
								<h6 className="font-weight-bold text-right mb-2">Subtotal : <span className="text-danger">&#8358;{total}</span></h6>
								<p className="seven-color mb-1 text-right">Extra charges may apply</p>
							</div>
						</div>}
					{
						(cart && cart.length > 0) &&
						<button onClick={handleCheckout} className="btn btn-success btn-block btn-lg">
							Checkout <CgArrowLongRight />
						</button>
					}
					<div className="pt-2"></div>
				</div>
			</div>
		</Col>
	)
}

const OrderItem = ({ meal, updateCart, restaurantId }) => {
	return (
		<CheckoutItem
			itemName={meal.name}
			price={meal.price}
			priceUnit="&#8358;"
			id={meal.id}
			restaurantId={restaurantId}
			qty={meal.quantity}
			show={true}
			minValue={MIN}
			maxValue={MAX}
			updateCart={updateCart}
		/>
	)
}

const CuisineOffered = ({ cuisine }) => (
	<span className="border-btn bg-white text-success mr-2" ><FiCheckCircle />{" "}{capitalize(cuisine)}</span>
)


// const CategoriesContainer = () => {
// 	return (
// 		<>
// 			<Row>
// 				<h5 className="mb-4 mt-3 col-md-12">Quick Bites <small className="h6 text-black-50">3 ITEMS</small></h5>
// 				<Col md={12}>
// 					<div className="bg-white rounded border shadow-sm mb-4">
// 						<QuickBite
// 							id={1}
// 							title='Chicken Tikka Sub'
// 							price={250}
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 						<QuickBite
// 							id={2}
// 							title='Cheese corn Roll'
// 							price={600}
// 							showBadge={true}
// 							badgeText='BEST SELLER'
// 							qty={1}
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 						<QuickBite
// 							id={3}
// 							title='Chicken Tikka Sub'
// 							price={250}
// 							showBadge={true}
// 							badgeText='Pure Veg'
// 							badgeVariant="success"
// 							qty={2}
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 					</div>
// 				</Col>
// 			</Row>
// 			<Row>
// 				<h5 className="mb-4 mt-3 col-md-12">Starters <small className="h6 text-black-50">3 ITEMS</small></h5>
// 				<Col md={12}>
// 					<div className="bg-white rounded border shadow-sm mb-4">
// 						<QuickBite
// 							id={1}
// 							itemClass="menu-list"
// 							image="/img/5.jpg"
// 							title='Chicken Tikka Sub'
// 							price={250}
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 						<QuickBite
// 							id={2}
// 							itemClass="menu-list"
// 							title='Cheese corn Roll'
// 							image="/img/2.jpg"
// 							price={600}
// 							showBadge={true}
// 							badgeText='BEST SELLER'
// 							qty={1}
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 						<QuickBite
// 							id={3}
// 							itemClass="menu-list"
// 							image="/img/3.jpg"
// 							title='Chicken Tikka Sub'
// 							price={250}
// 							showBadge={true}
// 							badgeText='Pure Veg'
// 							badgeVariant="success"
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 					</div>
// 				</Col>
// 			</Row>
// 			<Row>
// 				<h5 className="mb-4 mt-3 col-md-12">Soups <small className="h6 text-black-50">8 ITEMS</small></h5>
// 				<Col md={12}>
// 					<div className="bg-white rounded border shadow-sm">
// 						<QuickBite
// 							id={1}
// 							title='Chicken Tikka Sub'
// 							price={250}
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 						<QuickBite
// 							id={2}
// 							title='Cheese corn Roll'
// 							price={600}
// 							showBadge={true}
// 							badgeText='BEST SELLER'
// 							qty={1}
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 						<QuickBite
// 							id={3}
// 							title='Chicken Tikka Sub'
// 							price={250}
// 							showBadge={true}
// 							badgeText='Pure Veg'
// 							badgeVariant="success"
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 						<QuickBite
// 							id={1}
// 							title='Chicken Tikka Sub'
// 							price={250}
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 						<QuickBite
// 							id={2}
// 							title='Cheese corn Roll'
// 							price={600}
// 							showBadge={true}
// 							badgeText='BEST SELLER'
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 						<QuickBite
// 							id={3}
// 							title='Chicken Tikka Sub'
// 							price={250}
// 							showBadge={true}
// 							badgeText='Pure Veg'
// 							badgeVariant="success"
// 							priceUnit='$'
// 							getValue={getQty}
// 						/>
// 					</div>
// 				</Col>
// 			</Row>
// 		</>
// 	)
// }

export default Detail;
