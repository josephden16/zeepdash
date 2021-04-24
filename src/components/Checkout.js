import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Row, Col, Container, Form, InputGroup, Button, Tab, Nav, ButtonToolbar, ToggleButton, ToggleButtonGroup, Image } from 'react-bootstrap';
import ChooseAddressCard from './common/ChooseAddressCard';
import CheckoutItem from './common/CheckoutItem';
import AddAddressModal from './modals/AddAddressModal';
import { MIN, MAX, getTotalAmount, updateFirestoreCart, updateCartSession } from '../utils';
import { firestore } from '../firebase';
import Icofont from 'react-icofont';
import { UserContext } from './providers/AuthProvider';
import NotSignedIn from './NotSignedIn';


const Checkout = () => {

	const [showAddressModal, setShowAddressModal] = useState(false);
	const [restaurant, setRestaurant] = useState(null);
	const { restaurantId } = useParams();
	const user = useContext(UserContext);
	const hideAddressModal = () => setShowAddressModal(false);

	useEffect(() => {
		const fetchRestaurantData = async () => {
			const restaurantRef = firestore.collection("Restaurants").doc(restaurantId);
			try {
				const snapshot = await restaurantRef.get();
				const data = snapshot.data();
				// update state
				setRestaurant(data);
			} catch (error) {
				console.log(error)
			}
		}
		fetchRestaurantData();
	}, [restaurantId]);

	if (!user) {
		return <NotSignedIn />
	}

	return (
		<section className="offer-dedicated-body mt-4 mb-4 pt-2 pb-2">
			<AddAddressModal show={showAddressModal} onHide={hideAddressModal} />
			<Container>
				<Row>
					<OrderInfo setShowAddressModal={setShowAddressModal} />
					{restaurant && <Cart restaurant={restaurant} />}
				</Row>
			</Container>
		</section>
	);
}

const OrderInfo = ({ setShowAddressModal }) => {
	return (
		<Col md={8}>
			<div className="offer-dedicated-body-left">
				<div className="bg-white rounded shadow-sm p-4 mb-4">
					<h4 className="mb-1">Choose a delivery address</h4>
					<h6 className="mb-3 text-black-50">Multiple addresses in this location</h6>
					<Row>
						<Col md={6}>
							<ChooseAddressCard
								boxclassName="border border-success"
								title='Work'
								icoIcon='briefcase'
								iconclassName='icofont-3x'
								address='NCC, Model Town Rd, Pritm Nagar, Model Town, Ludhiana, Punjab 141002, India'
							/>
						</Col>
						<Col md={6}>
							<ChooseAddressCard
								title='Work'
								icoIcon='briefcase'
								iconclassName='icofont-3x'
								address='NCC, Model Town Rd, Pritm Nagar, Model Town, Ludhiana, Punjab 141002, India'
							/>
						</Col>
						<Col md={6}>
							<ChooseAddressCard
								title='Work'
								icoIcon='briefcase'
								iconclassName='icofont-3x'
								address='NCC, Model Town Rd, Pritm Nagar, Model Town, Ludhiana, Punjab 141002, India'
							/>
						</Col>
						<Col md={6}>
							<ChooseAddressCard
								title='Work'
								icoIcon='briefcase'
								iconclassName='icofont-3x'
								type="newAddress"
								address='NCC, Model Town Rd, Pritm Nagar, Model Town, Ludhiana, Punjab 141002, India'
								onAddNewClick={() => setShowAddressModal(true)}
							/>
						</Col>
					</Row>
				</div>
				<div className="pt-2"></div>
				<div className="bg-white rounded shadow-sm p-4 osahan-payment">
					<h4 className="mb-1">Choose payment method</h4>
					<h6 className="mb-3 text-black-50">Credit/Debit Cards</h6>
					<Tab.Container id="left-tabs-example" defaultActiveKey="first">
						<Row>
							<Col sm={4} className="pr-0">
								<Nav variant="pills" className="flex-column">
									<Nav.Link eventKey="first"><Icofont icon="credit-card" /> Credit/Debit Cards</Nav.Link>
									<Nav.Link eventKey="second"><Icofont icon="id-card" /> Food Cards</Nav.Link>
									<Nav.Link eventKey="third"><Icofont icon="card" /> Credit</Nav.Link>
									<Nav.Link eventKey="fourth"><Icofont icon="bank-alt" /> Netbanking</Nav.Link>
									<Nav.Link eventKey="fifth"><Icofont icon="money" /> Pay on Delivery</Nav.Link>
								</Nav>
							</Col>
							<Col sm={8} className="pl-0">
								<Tab.Content className='h-100'>
									<Tab.Pane eventKey="first">
										<h6 className="mb-3 mt-0 mb-3">Add new card</h6>
										<p>WE ACCEPT <span className="osahan-card">
											<Icofont icon="visa-alt" /> <Icofont icon="mastercard-alt" /> <Icofont icon="american-express-alt" /> <Icofont icon="payoneer-alt" /> <Icofont icon="apple-pay-alt" /> <Icofont icon="bank-transfer-alt" /> <Icofont icon="discover-alt" /> <Icofont icon="jcb-alt" />
										</span>
										</p>
										<Form>
											<div className="form-row">
												<Form.Group className="col-md-12">
													<Form.Label>Card number</Form.Label>
													<InputGroup>
														<Form.Control type="number" placeholder="Card number" />
														<InputGroup.Append>
															<Button variant="outline-secondary" type="button" id="button-addon2"><Icofont icon="card" /></Button>
														</InputGroup.Append>
													</InputGroup>
												</Form.Group>
												<Form.Group className="col-md-8">
													<Form.Label>Valid through(MM/YY)
																						 </Form.Label>
													<Form.Control type="number" placeholder="Enter Valid through(MM/YY)" />
												</Form.Group>
												<Form.Group className="col-md-4">
													<Form.Label>CVV
																						 </Form.Label>
													<Form.Control type="number" placeholder="Enter CVV Number" />
												</Form.Group>
												<Form.Group className="col-md-12">
													<Form.Label>Name on card
																						 </Form.Label>
													<Form.Control type="text" placeholder="Enter Card number" />
												</Form.Group>
												<Form.Group className="col-md-12">
													<Form.Check
														custom
														type="checkbox"
														id="custom-checkbox1"
														label="Securely save this card for a faster checkout next time."
													/>
												</Form.Group>
												<Form.Group className="col-md-12 mb-0">
													<Link to="/thanks" className="btn btn-success btn-block btn-lg">PAY $1329
																							 <Icofont icon="long-arrow-right" />
													</Link>
												</Form.Group>
											</div>
										</Form>
									</Tab.Pane>
									<Tab.Pane eventKey="second">
										<h6 className="mb-3 mt-0 mb-3">Add new food card</h6>
										<p>WE ACCEPT  <span className="osahan-card">
											<i className="icofont-sage-alt"></i> <i className="icofont-stripe-alt"></i> <i className="icofont-google-wallet-alt-1"></i>
										</span>
										</p>
										<Form>
											<div className="form-row">
												<Form.Group className="col-md-12">
													<Form.Label>Card number</Form.Label>
													<InputGroup>
														<Form.Control type="number" placeholder="Card number" />
														<InputGroup.Append>
															<Button variant="outline-secondary" type="button" id="button-addon2"><Icofont icon="card" /></Button>
														</InputGroup.Append>
													</InputGroup>
												</Form.Group>
												<Form.Group className="col-md-8">
													<Form.Label>Valid through(MM/YY)
																						 </Form.Label>
													<Form.Control type="number" placeholder="Enter Valid through(MM/YY)" />
												</Form.Group>
												<Form.Group className="col-md-4">
													<Form.Label>CVV
																						 </Form.Label>
													<Form.Control type="number" placeholder="Enter CVV Number" />
												</Form.Group>
												<Form.Group className="col-md-12">
													<Form.Label>Name on card
																						 </Form.Label>
													<Form.Control type="text" placeholder="Enter Card number" />
												</Form.Group>
												<Form.Group className="col-md-12">
													<Form.Check
														custom
														type="checkbox"
														id="custom-checkbox"
														label="Securely save this card for a faster checkout next time."
													/>
												</Form.Group>
												<Form.Group className="col-md-12 mb-0">
													<Link to="/thanks" className="btn btn-success btn-block btn-lg">PAY $1329
																							 <Icofont icon="long-arrow-right" />
													</Link>
												</Form.Group>
											</div>
										</Form>
									</Tab.Pane>
									<Tab.Pane eventKey="third">
										<div className="border shadow-sm-sm p-4 d-flex align-items-center bg-white mb-3">
											<Icofont icon="apple-pay-alt" className="mr-3 icofont-3x" />
											<div className="d-flex flex-column">
												<h5 className="card-title">Apple Pay</h5>
												<p className="card-text">Apple Pay lets you order now & pay later at no extra cost.</p>
												<Link to="#" className="card-link font-weight-bold">LINK ACCOUNT <Icofont icon="link-alt" /></Link>
											</div>
										</div>
										<div className="border shadow-sm-sm p-4 d-flex bg-white align-items-center mb-3">
											<Icofont icon="paypal-alt" className="mr-3 icofont-3x" />
											<div className="d-flex flex-column">
												<h5 className="card-title">Paypal</h5>
												<p className="card-text">Paypal lets you order now & pay later at no extra cost.</p>
												<Link to="#" className="card-link font-weight-bold">LINK ACCOUNT <Icofont icon="link-alt" /></Link>
											</div>
										</div>
										<div className="border shadow-sm-sm p-4 d-flex bg-white align-items-center">
											<Icofont icon="diners-club" className="mr-3 icofont-3x" />
											<div className="d-flex flex-column">
												<h5 className="card-title">Diners Club</h5>
												<p className="card-text">Diners Club lets you order now & pay later at no extra cost.</p>
												<Link to="#" className="card-link font-weight-bold">LINK ACCOUNT <Icofont icon="link-alt" /></Link>
											</div>
										</div>
									</Tab.Pane>
									<Tab.Pane eventKey="fourth">
										<h6 className="mb-3 mt-0 mb-3">Netbanking</h6>
										<Form>
											<ButtonToolbar>
												<ToggleButtonGroup className="d-flex w-100" type="checkbox" name="options" defaultValue={1}>
													<ToggleButton variant='info' value={1}>
														HDFC <Icofont icon="check-circled" />
													</ToggleButton>
													<ToggleButton variant='info' value={2}>
														ICICI <Icofont icon="check-circled" />
													</ToggleButton>
													<ToggleButton variant='info' value={3}>
														AXIS <Icofont icon="check-circled" />
													</ToggleButton>
												</ToggleButtonGroup>
											</ButtonToolbar>
											<hr />
											<div className="form-row">
												<Form.Group className="col-md-12">
													<Form.Label>Select Bank
																						 </Form.Label>
													<br />
													<Form.Control as="select" className="custom-select">
														<option>Bank</option>
														<option>One</option>
														<option>Two</option>
														<option>Three</option>
													</Form.Control>
												</Form.Group>
												<Form.Group className="col-md-12 mb-0">
													<Link to="/thanks" className="btn btn-success btn-block btn-lg">PAY $1329
																						 <Icofont icon="long-arrow-right" /></Link>
												</Form.Group>
											</div>
										</Form>
									</Tab.Pane>
									<Tab.Pane eventKey="fifth">
										<h6 className="mb-3 mt-0 mb-3">Cash</h6>
										<p>Please keep exact change handy to help us serve you better</p>
										<hr />
										<Form>
											<Link to="/thanks" className="btn btn-success btn-block btn-lg">PAY $1329
																			 <Icofont icon="long-arrow-right" /></Link>
										</Form>
									</Tab.Pane>
								</Tab.Content>
							</Col>
						</Row>
					</Tab.Container>
				</div>
			</div>
		</Col>
	)
}

const Cart = ({ updateCart, restaurant }) => {
	const { restaurantId } = useParams();
	const [cart, setCart] = useState(null);
	const user = useContext(UserContext);
	let total = cart ? getTotalAmount(cart) : 0;
	const history = useHistory();

	useEffect(() => {
		const fetchCart = async () => {
			const userRef = firestore.collection("Users").doc(user.id);
			const cartRef = userRef.collection("Cart").doc(restaurantId);

			try {
				const snapshot = await cartRef.get();
				if (snapshot.exists) {
					const data = snapshot.data();
					let cart = data.cart;
					// update cart session with new data from firestore
					updateCartSession(restaurantId, cart);
					// update react state
					setCart(cart);
				}
			} catch (error) {
				console.log(error);
			}
		}

		fetchCart();

	}, [restaurantId, user]);

	const getNextOrderNumber = async () => {
		const ordersRef = firestore.collection("counters").doc("QvjfmXtjAV7AdoYurLNX");
		const snapshot = await ordersRef.get();
		const number = snapshot.data().orderLastCount;
		await ordersRef.set({
			orderLastCount: number + 1
		}, { merge: true });

		return number + 1;

	}

	const createOrder = async () => {
		if (!user) {
			toast.error("You must be signed in to checkout");
			return;
		}
		const ordersRef = firestore.collection("Orders");
		const orderNumber = await getNextOrderNumber();
		try {
			await ordersRef.add({
				customerId: user.id,
				customerName: user.name,
				customerPhoneNumber: user.phone,
				customerLocation: user.billingAddress,
				restaurantId: restaurantId,
				restaurantName: restaurant.name,
				restaurantPhoneNumber: restaurant.phone,
				restaurantLocation: restaurant.address,
				orderId: orderNumber,
				productsOrdered: cart,
				totalAmount: total,
				paymentMethod: 'Flutter Wave Payment',
				orderCompleted: false,
				timeOrdered: new Date(),
			});
			toast.success("Order created");
		} catch (error) {
			toast.error("Failed to create order");
			console.log(error.message, error.code);
		}
	}

	const handleCheckout = () => {
		const restaurantId = restaurant.id;
		if (!user) {
			history.replace("/login");
		} else {
			// send cart data to firestore
			try {
				updateFirestoreCart(cart, user, restaurantId);
				createOrder();
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
					{
						(cart && cart.length > 0) &&
						<div>
							<h5 className="mb-2 text-white">Your Order</h5>
							<p className="mb-4 text-white">{cart.length} Items</p>
							<div className="bg-white rounded shadow-sm mb-2">
								{cart.map((meal) => <OrderItem restaurantId={restaurantId} updateCart={setCart} key={meal.id} meal={meal} />)}
							</div>
							<div className="mb-2 bg-white rounded p-2 clearfix">
								<Image fluid className="float-left" src="/img/wallet-icon.png" />
								<h6 className="font-weight-bold text-right mb-2">Subtotal : <span className="text-danger">&#8358;{total}</span></h6>
								<p className="seven-color mb-1 text-right">Extra charges may apply</p>
							</div>
						</div>
					}
					{
						(cart && cart.length > 0) &&
						<button onClick={handleCheckout} className="btn btn-success btn-block btn-lg">
							Checkout <Icofont icon="long-arrow-right" />
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

export default Checkout;
