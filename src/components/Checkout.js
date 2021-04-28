import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Row, Col, Container, Image, Form } from 'react-bootstrap';
import { v4 as uuid4 } from 'uuid';
import CheckoutItem from './common/CheckoutItem';
import EditAddressModal from './modals/EditAddressModal';
import { MIN, MAX, getTotalAmount, updateFirestoreCart, updateCartSession, DELIVERY_FEE, capitalize } from '../utils';
import { firestore } from '../firebase';
import Icofont from 'react-icofont';
import { UserContext } from './providers/AuthProvider';
import NotSignedIn from './NotSignedIn';
import Seo from './Seo';
import ChooseAddressCard from './common/ChooseAddressCard';
import Loading from './common/Loading';


const Checkout = () => {

	const [showAddressModal, setShowAddressModal] = useState(false);
	const [failedDataFetch, setFailedDataFetch] = useState(false);
	const [addresses, setAddresses] = useState(null);
	const [restaurant, setRestaurant] = useState(null);
	const { restaurantId } = useParams();
	const [cart, setCart] = useState(null);
	const user = useContext(UserContext);
	const hideAddressModal = () => setShowAddressModal(false);

	const fetchAddresses = async () => {
		if (!user) return null;

		const userId = user.id;

		const userRef = firestore.collection("Users").doc(userId);

		try {
			const snapshot = await userRef.get();
			let data = snapshot.data();
			let { locations } = data;
			setAddresses(locations);
			setFailedDataFetch(false);
		} catch (error) {
			setFailedDataFetch(true);
		}
	}

	useEffect(() => {

		const fetchAddresses = async () => {
			if (!user) return null;

			const userId = user.id;

			const userRef = firestore.collection("Users").doc(userId);

			try {
				const snapshot = await userRef.get();
				let data = snapshot.data();
				let { locations } = data;
				setAddresses(locations);
				setFailedDataFetch(false);
			} catch (error) {
				setFailedDataFetch(true);
			}
		}

		const fetchRestaurantData = async () => {
			const restaurantRef = firestore.collection("Restaurants").doc(restaurantId);
			try {
				const snapshot = await restaurantRef.get();
				const data = snapshot.data();
				// put the restaurant data in react state
				setRestaurant(data);
			} catch (error) {
				console.log(error)
			}
		}
		fetchRestaurantData();
		fetchAddresses();
	}, [restaurantId, user]);

	if (!user) {
		return <NotSignedIn />
	}

	const seo = {
		metaTitle: 'Checkout | ZeepDash',
		metaDescription: '',
	}

	return (
		<>
			<Seo seo={seo} />
			{(!restaurant && failedDataFetch === true) && <FailedToFetch />}
			{!restaurant && <Loading text="Fetching checkout data..."  />}
			{restaurant &&
				<section className="offer-dedicated-body mt-4 mb-4 pt-2 pb-2">
					<EditAddressModal show={showAddressModal} onHide={hideAddressModal} />
					<Container>
						<Row>
							<OrderInfo refresh={fetchAddresses} user={user} addresses={addresses} restaurant={restaurant} cart={cart} setShowAddressModal={setShowAddressModal} />
							{restaurant && <Cart cart={cart} updateCart={setCart} restaurant={restaurant} />}
						</Row>
					</Container>
				</section>
			}
		</>
	);
}

const OrderInfo = ({ refresh, addresses, restaurant, cart, user }) => {
	const [loading, setLoading] = useState(false);
	const [address, setAddress] = useState("");
	const [deliveryInstruction, setDeliveryInstruction] = useState("");
	const [deliveryArea, setDeliveryArea] = useState("");
	const [category, setCategory] = useState(""); const totalAmount = parseInt(getTotalAmount(cart) + DELIVERY_FEE);
	const { restaurantId } = useParams();
	const history = useHistory();

	// delivery location as specified by the user
	const [deliveryLocation, setDeliveryLocation] = useState(null);


	const getNextOrderNumber = async () => {
		const ordersRef = firestore.collection("counters").doc("QvjfmXtjAV7AdoYurLNX");
		const snapshot = await ordersRef.get();
		const number = snapshot.data().orderLastCount;
		await ordersRef.set({
			orderLastCount: number + 1
		}, { merge: true });

		return number + 1;

	}

	const createOrder = async (paymentResult) => {
		if (!user) {
			toast.error("You must be signed in to checkout");
			return;
		}

		let paymentStatus = (paymentResult["status"] === "successful") ? true : false;

		const ordersRef = firestore.collection("Orders");
		const orderNumber = await getNextOrderNumber();
		try {
			await ordersRef.add({
				customerId: user.id,
				customerName: user.name,
				customerPhoneNumber: user.phone,
				customerLocation: deliveryLocation.name,
				customerDeliveryInstruction: deliveryLocation.deliveryInstruction,
				customerDeliveryArea: deliveryLocation.area,
				restaurantId: restaurantId,
				restaurantName: restaurant.name,
				restaurantPhoneNumber: restaurant.phone,
				restaurantLocation: restaurant.address,
				orderId: orderNumber,
				productsOrdered: cart,
				totalAmount: paymentResult.amount,
				flutterwaveTransactionRef: paymentResult.tx_ref,
				flutterwaveRef: paymentResult.flw_ref,
				flutterwaveTransactionId: paymentResult.transaction_id,
				paymentStatus: paymentStatus,
				paymentMethod: 'Flutterwave Payment',
				orderCompleted: false,
				timeOrdered: new Date(),
			});
			toast.success("Your order has been placed, please wait for your delivery");
		} catch (error) {
			toast.error("Failed to create order");
			console.log(error.message, error.code);
		}
	}

	const config = {
		public_key: 'FLWPUBK_TEST-eb8e43a97c6868b180417e27034530b7-X',
		tx_ref: Date.now(),
		amount: totalAmount,
		currency: 'NGN',
		payment_options: 'card,banktransfer,ussd',
		customer: {
			email: user.email,
			phonenumber: user.phone,
			name: user.name,
		},
		customizations: {
			title: 'Order Payment',
			description: 'Payment for meals in cart',
			logo: 'https://www.zeepdash.com/img/favicon.png',
		},
	};

	const handleFlutterPayment = useFlutterwave(config);

	const handlePayment = () => {
		if (!deliveryLocation) {
			toast.error("Please select a delivery location");
			return;
		}

		handleFlutterPayment({
			callback: (response) => {
				updateFirestoreCart([], user, restaurantId);
				createOrder(response);
				history.push("/thanks")
				closePaymentModal();
			}
		})
	}

	// address
	const addAddress = async () => {
		if (addresses.length === 3) {
			toast.info("You can't add more than 3 addresses");
			return;
		}
		if (address === "" && category === "" && deliveryArea && deliveryInstruction) {
			toast.warning("Please fill all form fields");
			return;
		}

		if (!address) {
			toast.warning("Please enter a valid address");
			return;
		}

		if (!deliveryArea) {
			toast.warning("Please enter the area you stay");
			return;
		}

		if (!deliveryInstruction) {
			toast.warning("Please enter a delivery instruction");
			return;
		}

		if (category === "") {
			toast.warning("Please select a category");
			return;
		}

		let id = uuid4();
		let data = {
			id: id,
			name: address,
			category: category,
			area: deliveryArea,
			deliveryInstruction: deliveryInstruction
		}
		let newLocations = addresses.concat(data);
		setLoading(true);
		try {
			const userRef = firestore.collection("Users").doc(user.id);
			await userRef.set({ locations: newLocations }, { merge: true });
			setLoading(false);
			toast.success("Address added");
			refresh();
		} catch (error) {
			toast.error("Failed to add address");
			setLoading(false);
		}
	}

	if (!cart) {
		return null;
	}

	return (
		<Col md={8}>
			<div className="offer-dedicated-body-left">
				<div className="bg-white rounded shadow-sm p-4 mb-4">
					<h3 className="font-weight-bold mt-3 mb-2">Add a delivery location</h3>
					<div className="auth-animation">
						<Row>
							<Col md={9} lg={8}>
								<Form className="mt-2 mb-2" onSubmit={(evt) => { evt.preventDefault() }}>
									<div className="form-label-group">
										<input type="text" onChange={(evt) => setAddress(evt.target.value)} className="input" id="inputAddress" placeholder="Address" />
									</div>
									<div className="form-label-group">
										<input type="text" onChange={(evt) => setDeliveryArea(evt.target.value)} className="input" id="inputDeliveryArea" placeholder="Area" />
									</div>
									<div className="form-label-group">
										<input type="text" onChange={(evt) => setDeliveryInstruction(evt.target.value)} className="input" id="inputDeliveryInstruction" placeholder="Delivery Instruction" />
									</div>
									<div className="form-label-group flex flex-row">
										<Form.Control onChange={(evt) => setCategory(evt.target.value)} as="select">
											<option value="">Select a category...</option>
											<option value="home">Home</option>
											<option value="work">Work</option>
											<option value="other">Other</option>
										</Form.Control>
									</div>
									<button disabled={loading ? true : false} onClick={addAddress} className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2">
										{!loading && <span>Add Location</span>}
										{loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
									</button>
								</Form>
							</Col>
						</Row>
					</div>
				</div>
				<div className="bg-white rounded shadow-sm p-4 mb-4">
					<h4 className="mb-3">Choose a delivery location</h4>
					<Row>
						{addresses && addresses.map(address => {
							let iconName = "";
							switch (address.category) {
								case "home":
									iconName = "home";
									break;
								case "work":
									iconName = "briefcase";
									break;
								default:
									iconName = "location-pin";
									break;
							}
							return (
								<Col md={6} key={address.id} >
									<ChooseAddressCard
										title={capitalize(address.category)}
										icoIcon={iconName}
										iconclassName='icofont-3x'
										address={address.name}
										addressData={address}
										setDeliveryLocation={setDeliveryLocation}
									/>
								</Col>
							)
						})}
						{
							(addresses && addresses.length < 1) &&
							<Col md={12} className="h6">
								You don't have any address, fill the form above to create one.
							</Col>
						}
					</Row>
				</div>
				<div className="bg-white rounded shadow-sm p-4 osahan-payment">
					<h3 className="text-center" style={{ fontWeight: 'bold' }}>Complete your order</h3>
					<h4 className="text-center">Pay with <Image fluid style={{ width: '140px' }} src="/img/flutterwave.svg" alt="Flutterwave" /></h4>
					<div>
						<button onClick={handlePayment} className="btn btn-success btn-block btn-lg">
							PAY ₦{totalAmount}
							<Icofont icon="long-arrow-right" />
						</button>
					</div>
				</div>
			</div>
		</Col>
	)
}

const Cart = ({ cart, updateCart }) => {
	const { restaurantId } = useParams();
	const user = useContext(UserContext);
	let total = cart ? getTotalAmount(cart) : 0;
	useEffect(() => {
		const fetchCart = async () => {
			const userRef = firestore.collection("Users").doc(user.id);
			const cartRef = userRef.collection("Cart").doc(restaurantId);

			try {
				const snapshot = await cartRef.get();
				// cart data comes from firestore since only authenticated users should be able to checkout
				if (snapshot.exists) {
					const data = snapshot.data();
					let cart = data.cart;
					// update sessionStorage with new cart data from firestore
					updateCartSession(restaurantId, cart);
					// update react state with new cart data from firestore
					updateCart(cart);
				}
			} catch (error) {
				console.log(error);
			}
		}

		fetchCart();

	}, [restaurantId, updateCart, user.id]);

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
								{cart.map((meal) => <OrderItem restaurantId={restaurantId} updateCart={updateCart} key={meal.id} meal={meal} />)}
							</div>
							<div className="mb-2 bg-white rounded p-2 clearfix">
								<Image fluid className="float-left" src="/img/wallet-icon.png" />
								<p className="font-weight-bold text-right mb-2">Subtotal : <span className="text-danger">&#8358;{total}</span></p>
								<p className="font-weight-bold text-right mb-2">Delivery Fee : <span className="text-danger">&#8358;{DELIVERY_FEE}</span></p>
								<h6 className="font-weight-bold text-right mb-2">Total : <span className="text-danger">&#8358;{total + DELIVERY_FEE}</span></h6>
								<p className="seven-color mb-1 text-right">Extra charges may apply</p>
							</div>
						</div>
					}
					{/* {
						(cart && cart.length > 0) &&
						<button onClick={handleCheckout} className="btn btn-success btn-block btn-lg">
							Checkout <Icofont icon="long-arrow-right" />
						</button>
					} */}
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


const FailedToFetch = () => {
	return (
		<div style={{ fontSize: '17px' }} className="bg-white text-center pt-5 pb-5">
			Failed to fetch addresses.
		</div>
	)
}

export default Checkout;
