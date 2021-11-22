import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { Row, Col, Container, Image } from "react-bootstrap";
import CheckoutItem from "./common/CheckoutItem";
import EditAddressModal from "./modals/EditAddressModal";
import {
  MIN,
  MAX,
  getTotalAmount,
  updateFirestoreCart,
  updateCartSession,
  DELIVERY_FEE,
  capitalize,
  isRestaurantOpen,
} from "../utils";
import { firestore } from "../firebase";
import { CgArrowLongRight } from "react-icons/cg";
import { UserContext } from "./providers/AuthProvider";
import NotSignedIn from "./NotSignedIn";
import Seo from "./Seo";
import ChooseAddressCard from "./common/ChooseAddressCard";
import NewAddressCard from "./common/NewAddressCard";
import Loading from "./common/Loading";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { CartContext } from "./providers/CartProvider";

const Checkout = () => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [failedDataFetch, setFailedDataFetch] = useState(false);
  const [addresses, setAddresses] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const { restaurantId } = useParams();
  const user = useContext(UserContext);
  const hideAddressModal = () => setShowAddressModal(false);

  const fetchAddresses = async () => {
    if (!user) return null;

    const userId = user.id;

    const collectionName =
      process.env.NODE_ENV === "production" ? "Users" : "Users_dev";
    const userRef = doc(firestore, collectionName, userId);

    try {
      const snapshot = await getDoc(userRef);
      if (snapshot.exists) {
        let data = snapshot.data();
        let { locations } = data;
        if (locations.length > 0) {
          setAddresses(locations);
          setFailedDataFetch(false);
        } else {
          setAddresses([]);
        }
      } else {
        setAddresses([]);
        setFailedDataFetch(false);
      }
    } catch (error) {
      setFailedDataFetch(true);
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return null;

      const userId = user.id;

      const collectionName =
        process.env.NODE_ENV === "production" ? "Users" : "Users_dev";
      const userRef = doc(firestore, collectionName, userId);

      try {
        const snapshot = await getDoc(userRef);
        if (snapshot.exists) {
          let data = snapshot.data();
          let { locations } = data;
          if (locations.length > 0) {
            setAddresses(locations);
            setFailedDataFetch(false);
          } else {
            setAddresses([]);
          }
        } else {
          setAddresses([]);
          setFailedDataFetch(false);
        }
      } catch (error) {
        setFailedDataFetch(true);
      }
    };

    const fetchRestaurantData = async () => {
      const collectionName =
        process.env.NODE_ENV === "production"
          ? "Restaurants"
          : "Restaurants_dev";
      const restaurantRef = doc(firestore, collectionName, restaurantId);
      try {
        const snapshot = await getDoc(restaurantRef);
        const data = snapshot.data();
        // put the restaurant data in react state
        setRestaurant(data);
      } catch (error) {
        // console.log(error)
      }
    };
    fetchRestaurantData();
    fetchAddresses();
  }, [restaurantId, user]);

  if (!user) {
    return <NotSignedIn />;
  }

  const seo = {
    metaTitle: "Checkout | ZeepDash",
    metaDescription: "",
  };

  return (
    <>
      <Seo seo={seo} />
      {!restaurant && failedDataFetch === true && <FailedToFetch />}
      {!restaurant && <Loading text="Fetching checkout data..." />}
      {restaurant && (
        <section className="offer-dedicated-body mt-4 mb-4 pt-2 pb-2">
          <EditAddressModal show={showAddressModal} onHide={hideAddressModal} />
          <Container>
            <Row>
              <OrderInfo
                refresh={fetchAddresses}
                user={user}
                addresses={addresses}
                restaurant={restaurant}
                setShowAddressModal={setShowAddressModal}
              />
              {restaurant && <Cart restaurant={restaurant} />}
            </Row>
          </Container>
        </section>
      )}
    </>
  );
};

const OrderInfo = ({ refresh, addresses, restaurant, user }) => {
  const { cart } = useContext(CartContext);
  const totalAmount = parseInt(getTotalAmount(cart) + DELIVERY_FEE);
  const { restaurantId } = useParams();
  const history = useHistory();
  const openingTime = restaurant.openingTime;
  const closingTime = restaurant.closingTime;
  // delivery location as specified by the user
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const getNextOrderNumber = async () => {
    const documentId =
      process.env.NODE_ENV === "production"
        ? "QvjfmXtjAV7AdoYurLNX"
        : "jYWBXOsQpplQtPGZbN2L";
    const counterRef = doc(firestore, "counters", documentId);
    const snapshot = await getDoc(counterRef);
    const number = snapshot.data().orderLastCount;
    await setDoc(
      counterRef,
      {
        orderLastCount: number + 1,
      },
      { merge: true }
    );

    return number + 1;
  };

  const createOrder = async (paymentResult) => {
    // ensure users can't place orders when restaurant's are closed
    const restaurantOpen = isRestaurantOpen(openingTime, closingTime);
    if (!restaurantOpen) {
      toast.info("You can't checkout while a restaurant restaurant is closed");
      return;
    }

    let paymentStatus =
      paymentResult["status"] === "successful" ||
      paymentResult["status"] === "success"
        ? true
        : false;
    const collectionName =
      process.env.NODE_ENV === "production" ? "Orders" : "Orders_dev";
    const ordersRef = collection(firestore, collectionName);
    const orderNumber = await getNextOrderNumber();
    try {
      await addDoc(ordersRef, {
        customerId: user.id,
        customerName: user.name,
        customerPhoneNumber: user.phone,
        customerAddress: deliveryLocation.name,
        customerDeliveryInstruction: deliveryLocation.deliveryInstruction || "",
        googleMapsURL: deliveryLocation.googleMapsURL,
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
        paymentMethod: "Flutterwave Payment",
        orderCompleted: true,
        timeOrdered: new Date(),
      });
    } catch (error) {
      toast.error("Failed to create order");
    }
  };
  // flutterwave payment config
  const config = {
    public_key:
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY
        : process.env.REACT_APP_FLUTTERWAVE_DEV_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: totalAmount,
    currency: "NGN",
    payment_options: "card,banktransfer,ussd",
    customer: {
      email: user.email,
      phonenumber: user.phone,
      name: user.name,
    },
    customizations: {
      title: "Order Payment",
      description: "Payment for meals in cart",
      logo: "",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    if (!user) {
      toast.error("You must be signed in to checkout");
      return;
    }
    if (!deliveryLocation) {
      toast.error("Please select a delivery location");
      return;
    }
    if (!cart || cart.length < 1) {
      toast.error("You must have meals in your cart to checkout");
      return;
    }

    handleFlutterPayment({
      callback: (response) => {
        if (
          response["status"] === "success" ||
          response["status"] === "successful"
        ) {
          createOrder(response);
          updateFirestoreCart([], user, restaurantId);
          updateCartSession(restaurantId, []);
          history.push("/thanks");
        } else {
          toast.error("Payment failed");
          closePaymentModal();
        }
      },
    });
  };

  if (!cart) {
    return null;
  }
	console.log("key: ", process.env.REACT_APP_FLUTTERWAVE_DEV_PUBLIC_KEY);
  return (
    <Col md={8}>
      <div className="offer-dedicated-body-left">
        {/* <AddDeliveryLocation addresses={addresses} refresh={refresh} /> */}
        <ChooseDeliveryLocation
          addresses={addresses}
          setDeliveryLocation={setDeliveryLocation}
        />
        <div className="bg-white rounded shadow-sm p-4 osahan-payment">
          <h3 className="text-center" style={{ fontWeight: "bold" }}>
            Complete Your Order
          </h3>
          <h4 className="text-center">
            Pay with{" "}
            <Image
              fluid
              style={{ width: "140px" }}
              src="/img/flutterwave.svg"
              alt="Flutterwave"
            />
          </h4>
          <div>
            <button
              onClick={handlePayment}
              className="btn btn-success btn-block btn-lg"
            >
              PAY ₦{totalAmount}
              <CgArrowLongRight />
            </button>
          </div>
        </div>
      </div>
    </Col>
  );
};

const Cart = () => {
  const { cart, updateCart } = useContext(CartContext);
  const { restaurantId } = useParams();
  const user = useContext(UserContext);
  let total = cart ? getTotalAmount(cart) : 0;
  useEffect(() => {
    const fetchCart = async () => {
      const collectionName =
        process.env.NODE_ENV === "production" ? "Users" : "Users_dev";
      const userRef = doc(firestore, collectionName, user.id);
      const cartRef = doc(userRef, "Cart", restaurantId);
      try {
        const snapshot = await getDoc(cartRef);
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
        // console.log(error);
      }
    };

    fetchCart();
  }, [restaurantId, updateCart, user.id]);

  return (
    <Col md={4}>
      <div className="generator-bg rounded shadow-sm mb-4 p-4 osahan-cart-item">
        <div>
          {(!cart || cart.length < 1) && (
            <div
              className="mt-2"
              style={{ display: "flex", flexFlow: "column nowrap" }}
            >
              <Image
                draggable={false}
                src="/img/empty-cart.svg"
                alt="empty-cart"
                fluid
                style={{ width: "20%", margin: "auto" }}
              />
              <p
                style={{ fontSize: "15px" }}
                className="text-center text-white mt-3"
              >
                Your cart is empty. Add meals to your cart.
              </p>
            </div>
          )}
          {cart && cart.length > 0 && (
            <div>
              <h5 className="mb-2 text-white">Your Order</h5>
              <p className="mb-4 text-white">{cart.length} Items</p>
              <div className="bg-white rounded shadow-sm mb-2">
                {cart.map((meal) => (
                  <OrderItem
                    restaurantId={restaurantId}
                    updateCart={updateCart}
                    key={meal.id}
                    meal={meal}
                  />
                ))}
              </div>
              <div className="mb-2 bg-white rounded p-2 clearfix">
                <Image
                  fluid
                  className="float-left"
                  src="/img/wallet-icon.png"
                />
                <p className="font-weight-bold text-right mb-2">
                  Subtotal : <span className="text-danger">&#8358;{total}</span>
                </p>
                <p className="font-weight-bold text-right mb-2">
                  Delivery Fee :{" "}
                  <span className="text-danger">&#8358;{DELIVERY_FEE}</span>
                </p>
                <h6 className="font-weight-bold text-right mb-2">
                  Total :{" "}
                  <span className="text-danger">
                    &#8358;{total + DELIVERY_FEE}
                  </span>
                </h6>
                <p className="seven-color mb-1 text-right">
                  Extra charges may apply
                </p>
              </div>
            </div>
          )}
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
  );
};

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
  );
};

const ChooseDeliveryLocation = ({ addresses, setDeliveryLocation }) => {
  return (
    <div className="bg-white rounded shadow-sm p-4 mb-4">
      <h4 className="mb-4 text-center">Choose a delivery location</h4>
      <Row>
        {addresses &&
          addresses.map((address) => {
            let iconName = "";
            switch (address.category) {
              case "home":
                iconName = "home";
                break;
              case "work":
                iconName = "briefcase";
                break;
              default:
                iconName = "location";
                break;
            }
            return (
              <Col md={6} key={address.id}>
                <ChooseAddressCard
                  title={capitalize(address.category)}
                  icon={iconName}
                  iconclassName="h1"
                  address={address.name}
                  addressData={address}
                  setDeliveryLocation={setDeliveryLocation}
                />
              </Col>
            );
          })}
        <Col md={6}>
          <NewAddressCard iconclassName="h1" addresses={addresses} />
        </Col>
      </Row>
    </div>
  );
};

const FailedToFetch = () => {
  return (
    <div
      style={{ fontSize: "17px" }}
      className="bg-white text-center pt-5 pb-5"
    >
      Failed to fetch addresses.
    </div>
  );
};

export default Checkout;
