import React, { useContext, useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import OrderCard from '../common/OrderCard';
import { UserContext } from '../providers/AuthProvider';
import Seo from '../Seo';
import Loading from '../common/Loading';
import { generateSlug } from '../../utils';


const seo = {
	metaTitle: 'Orders | ZeepDash',
	metaDescription: 'View all your completed orders and reorder previous ones'
}


const Orders = () => {
	const user = useContext(UserContext);
	return (
		<>
			<Seo seo={seo} />
			<div className='p-4 bg-white shadow-sm'>
				<OrdersContainer user={user} />
			</div>
		</>
	)
}

const OrdersContainer = ({ user }) => {
	const [orders, setOrders] = useState(null);
	const [failedDataFetch, setFailedDataFetch] = useState(false);
	const userId = user.id;

	useEffect(() => {
		const fetchOrders = async () => {
			const ordersRef = firestore.collection("Orders")
				.where("customerId", "==", userId);
			try {
				const snapshot = await ordersRef.get();
				if (!snapshot.empty) {
					let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
					data = data.filter(order => order.orderCompleted === true);
					console.log(data);
					setOrders(data);
				} else {
					const data = [];
					setOrders(data);
				}
			} catch (error) {
				setFailedDataFetch(true);
			}
		}

		fetchOrders();
	}, [userId]);


	return (
		<>
			{(!orders && failedDataFetch === true) && <FailedToFetch />}
			{!orders && <Loading text="Fetching orders..." />}
			{
				(orders && orders.length > 1) &&
				<>
					<h4 className="font-weight-bold mt-0 mb-4">Past Orders</h4>
					{orders.map(order => {
						// order time
						let time = order.timeOrdered.seconds;
						let formattedTime = new Date(time * 1000).toLocaleString();
						// delivery time
						let timeDelivered = order.timeDelivered;
						let formattedDeliveryTime = timeDelivered !== undefined ?  new Date(timeDelivered * 1000).toLocaleString() : '';
						// orders
						let formattedOrders = [];
						let productsOrdered = order.productsOrdered;
						productsOrdered.forEach((order) => {
							let formattedOrder = `${order.name} x ${order.quantity}`;
							formattedOrders = formattedOrders.concat(formattedOrder);
						});
						formattedOrders = formattedOrders.join(", ");
						return (
							(
								<OrderCard
									key={order.id}
									image='/img/3.jpg'
									imageAlt={order.restaurantName}
									orderNumber={order.orderId}
									orderDate={formattedTime || ''}
									deliveredDate={formattedDeliveryTime || ''}
									orderTitle={order.restaurantName}
									address={order.restaurantLocation}
									orderProducts={formattedOrders || ''}
									orderTotal={order.totalAmount}
									helpLink='#'
									detailLink={`/restaurant/${generateSlug(order.restaurantName)}`}
								/>
							)
						)
					})}
				</>
			}
			{
				(orders && orders.length === 0) && <NoOrders />
			}
		</>
	)
}

const FailedToFetch = () => {
	return (
		<div style={{ fontSize: '17px' }} className="bg-white text-center pt-5 pb-5">
			Failed to fetch orders
		</div>
	)
}

const NoOrders = () => {
	return (
		<div style={{ fontSize: '17px' }} className="bg-white text-center pt-5 pb-5">
			You have no past orders.
		</div>
	)
}

export default Orders;
