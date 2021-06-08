import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Container, Tab, Nav, Image, Button } from 'react-bootstrap';
import Seo from './Seo';
import NotFound from './NotFound';
import Loading from './common/Loading';
import GalleryCarousel from './common/GalleryCarousel';
import { FiNavigation } from 'react-icons/fi';
import { IoFastFood } from 'react-icons/io5';
import { BsClockFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { MealsContainer, Cart, RestaurantOpenStatus, RestaurantInfoTab } from './detail';


const Detail = () => {
	const [restaurant, setRestaurant] = useState(null);
	const [restaurantOffers, setRestaurantOffers] = useState(null);
	const [loading, setLoading] = useState(false);
	const [notFound, setNotFound] = useState(false);
	const { slug } = useParams();

	useEffect(() => {
		const collectionName = process.env.NODE_ENV === 'production' ? 'Restaurants' : 'Restaurants_dev';
		const mealsCollectionName = process.env.NODE_ENV === 'production' ? 'Meals' : 'Meals_dev';
		const restaurantRef = collection(firestore, collectionName);
		const offersRef = collection(firestore, mealsCollectionName)
		const restaurantQuery = query(restaurantRef, where("slug", "==", slug));
		const offersQuery = query(offersRef, where("restaurantSlug", "==", slug));

		const fetchRestaurantData = async () => {
			setLoading(true);

			try {
				const restaurantSnapshot = await getDocs(restaurantQuery);

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
			}
		}

		const fetchRestaurantOffers = async () => {
			try {
				const offersSnapshot = await getDocs(offersQuery);
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
	// share page with the Native Share API
	const sharePage = async () => {

		const data = {
			title: 'ZeepDash',
			text: `Check out ${restaurant.name}'s page on ZeepDash.`,
			url: `https://zeepdash.com/restaurant/${restaurant.slug}`,
		}

		try {
			await navigator.share(data);
		} catch {}
	}

	return (
		<>
			<Seo seo={seo} />
			<section className="restaurant-detailed-banner">
				<div className="text-center">
					<Image fluid className="cover restaurant-detail-bg" draggable={false} alt={restaurant.name} style={{ width: '100%', objectFit: 'fill' }} src={restaurant.backgroundImageURL || '/img/restaurant-bg.webp'} />
				</div>
				<div className="restaurant-detailed-header">
					<Container>
						<Row className="d-flex align-items-end">
							<Col md={8}>
								<div className="restaurant-detailed-header-left">
									<Image draggable={false} fluid className="mr-3 float-left" alt="osahan" src={restaurant.photoURL || '/img/1.jpg'} />
									<h2 className="text-white">{restaurant.name}</h2>
									<p className="text-white mb-1"><FiNavigation /> {" "}{restaurant.address.toUpperCase()} <RestaurantOpenStatus openingTime={restaurant.openingTime} closingTime={restaurant.closingTime} />
									</p>
									<p className="text-white mb-0"><IoFastFood />{" "}{restaurant.cuisines.join(" , ").toUpperCase()}</p>
								</div>
							</Col>
							<Col md={4}>
								<div className="restaurant-detailed-header-right text-right mt-2">
									<div className="my-3">
										<button style={{ outline: "none", border: '0', background: 'transparent' }}>
											<a href={`whatsapp://send?text=Check out ${restaurant.name}'s page on ZeepDash, https://www.zeepdash.com/restaurant/${restaurant.slug}`} data-action="share/whatsapp/share">
												<img alt="WhatsApp" style={{ width: '25px' }} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik0wLDUxMmwzNS4zMS0xMjhDMTIuMzU5LDM0NC4yNzYsMCwzMDAuMTM4LDAsMjU0LjIzNEMwLDExNC43NTksMTE0Ljc1OSwwLDI1NS4xMTcsMCAgUzUxMiwxMTQuNzU5LDUxMiwyNTQuMjM0UzM5NS40NzYsNTEyLDI1NS4xMTcsNTEyYy00NC4xMzgsMC04Ni41MS0xNC4xMjQtMTI0LjQ2OS0zNS4zMUwwLDUxMnoiIGZpbGw9IiNlZGVkZWQiIGRhdGEtb3JpZ2luYWw9IiNlZGVkZWQiPjwvcGF0aD4KPHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBkPSJNMTM3LjcxLDQzMC43ODZsNy45NDUsNC40MTRjMzIuNjYyLDIwLjMwMyw3MC42MjEsMzIuNjYyLDExMC4zNDUsMzIuNjYyICBjMTE1LjY0MSwwLDIxMS44NjItOTYuMjIxLDIxMS44NjItMjEzLjYyOFMzNzEuNjQxLDQ0LjEzOCwyNTUuMTE3LDQ0LjEzOFM0NC4xMzgsMTM3LjcxLDQ0LjEzOCwyNTQuMjM0ICBjMCw0MC42MDcsMTEuNDc2LDgwLjMzMSwzMi42NjIsMTEzLjg3Nmw1LjI5Nyw3Ljk0NWwtMjAuMzAzLDc0LjE1MkwxMzcuNzEsNDMwLjc4NnoiIGZpbGw9IiM1NWNkNmMiIGRhdGEtb3JpZ2luYWw9IiM1NWNkNmMiPjwvcGF0aD4KPHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBkPSJNMTg3LjE0NSwxMzUuOTQ1bC0xNi43NzItMC44ODNjLTUuMjk3LDAtMTAuNTkzLDEuNzY2LTE0LjEyNCw1LjI5NyAgYy03Ljk0NSw3LjA2Mi0yMS4xODYsMjAuMzAzLTI0LjcxNywzNy45NTljLTYuMTc5LDI2LjQ4MywzLjUzMSw1OC4yNjIsMjYuNDgzLDkwLjA0MXM2Ny4wOSw4Mi45NzksMTQ0Ljc3MiwxMDUuMDQ4ICBjMjQuNzE3LDcuMDYyLDQ0LjEzOCwyLjY0OCw2MC4wMjgtNy4wNjJjMTIuMzU5LTcuOTQ1LDIwLjMwMy0yMC4zMDMsMjIuOTUyLTMzLjU0NWwyLjY0OC0xMi4zNTkgIGMwLjg4My0zLjUzMS0wLjg4My03Ljk0NS00LjQxNC05LjcxbC01NS42MTQtMjUuNmMtMy41MzEtMS43NjYtNy45NDUtMC44ODMtMTAuNTkzLDIuNjQ4bC0yMi4wNjksMjguMjQ4ICBjLTEuNzY2LDEuNzY2LTQuNDE0LDIuNjQ4LTcuMDYyLDEuNzY2Yy0xNS4wMDctNS4yOTctNjUuMzI0LTI2LjQ4My05Mi42OS03OS40NDhjLTAuODgzLTIuNjQ4LTAuODgzLTUuMjk3LDAuODgzLTcuMDYyICBsMjEuMTg2LTIzLjgzNGMxLjc2Ni0yLjY0OCwyLjY0OC02LjE3OSwxLjc2Ni04LjgyOGwtMjUuNi01Ny4zNzlDMTkzLjMyNCwxMzguNTkzLDE5MC42NzYsMTM1Ljk0NSwxODcuMTQ1LDEzNS45NDUiIGZpbGw9IiNmZWZlZmUiIGRhdGEtb3JpZ2luYWw9IiNmZWZlZmUiPjwvcGF0aD4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==" />
											</a>
										</button>
										{/* <button style={{ outline: "none", border: '0', background: 'transparent' }}>
											<a target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=Check out ${restaurant.name}'s page on Zeepdash, https://www.zeepdash.com/restaurant/${restaurant.slug}`}>
												<img style={{ width: '25px' }} src="/img/twitter.svg" alt="Twitter" />
											</a>
										</button> */}
										<button style={{ outline: "none", border: '0', background: 'transparent' }} class="fb-share-button" data-href="https://www.zeepdash.com/restaurant/victoria-olaopa" data-layout="button_count" data-size="small">
											<a target="_blank" rel="noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.zeepdash.com%2Frestaurant%2Fvictoria-olaopa&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">
												<img style={{ width: '25px' }} alt="Facebook" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggc3R5bGU9ImZpbGw6IzE5NzZEMjsiIGQ9Ik00NDgsMEg2NEMyOC43MDQsMCwwLDI4LjcwNCwwLDY0djM4NGMwLDM1LjI5NiwyOC43MDQsNjQsNjQsNjRoMzg0YzM1LjI5NiwwLDY0LTI4LjcwNCw2NC02NFY2NA0KCUM1MTIsMjguNzA0LDQ4My4yOTYsMCw0NDgsMHoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGQUZBRkE7IiBkPSJNNDMyLDI1NmgtODB2LTY0YzAtMTcuNjY0LDE0LjMzNi0xNiwzMi0xNmgzMlY5NmgtNjRsMCwwYy01My4wMjQsMC05Niw0Mi45NzYtOTYsOTZ2NjRoLTY0djgwaDY0DQoJdjE3Nmg5NlYzMzZoNDhMNDMyLDI1NnoiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K" />
											</a>
										</button>
										<button onClick={sharePage} style={{ outline: "none", border: '0', background: 'transparent' }}>
											<img alt="share" style={{ width: '25px' }} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMS42MjYgNTExLjYyNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8cGF0aCBkPSJNNTA2LjIwNiwxNzkuMDEyTDM2MC4wMjUsMzIuODM0Yy0zLjYxNy0zLjYxNy03Ljg5OC01LjQyNi0xMi44NDctNS40MjZzLTkuMjMzLDEuODA5LTEyLjg0Nyw1LjQyNiAgIGMtMy42MTcsMy42MTktNS40MjgsNy45MDItNS40MjgsMTIuODV2NzMuMDg5aC02My45NTNjLTEzNS43MTYsMC0yMTguOTg0LDM4LjM1NC0yNDkuODIzLDExNS4wNkM1LjA0MiwyNTkuMzM1LDAsMjkxLjAzLDAsMzI4LjkwNyAgIGMwLDMxLjU5NCwxMi4wODcsNzQuNTE0LDM2LjI1OSwxMjguNzYyYzAuNTcsMS4zMzUsMS41NjYsMy42MTQsMi45OTYsNi44NDljMS40MjksMy4yMzMsMi43MTIsNi4wODgsMy44NTQsOC41NjUgICBjMS4xNDYsMi40NzEsMi4zODQsNC41NjUsMy43MTUsNi4yNzZjMi4yODIsMy4yMzcsNC45NDgsNC44NTksNy45OTQsNC44NTljMi44NTUsMCw1LjA5Mi0wLjk1MSw2LjcxMS0yLjg1NCAgIGMxLjYxNS0xLjkwMiwyLjQyNC00LjI4NCwyLjQyNC03LjEzMmMwLTEuNzE4LTAuMjM4LTQuMjM2LTAuNzE1LTcuNTY5Yy0wLjQ3Ni0zLjMzMy0wLjcxNS01LjU2NC0wLjcxNS02LjcwOCAgIGMtMC45NTMtMTIuOTM4LTEuNDI5LTI0LjY1My0xLjQyOS0zNS4xMTRjMC0xOS4yMjMsMS42NjgtMzYuNDQ5LDQuOTk2LTUxLjY3NWMzLjMzMy0xNS4yMjksNy45NDgtMjguNDA3LDEzLjg1LTM5LjU0MyAgIGM1LjkwMS0xMS4xNCwxMy41MTItMjAuNzQ1LDIyLjg0MS0yOC44MzVjOS4zMjUtOC4wOSwxOS4zNjQtMTQuNzAyLDMwLjExOC0xOS44NDJjMTAuNzU2LTUuMTQxLDIzLjQxMy05LjE4NiwzNy45NzQtMTIuMTM1ICAgYzE0LjU2LTIuOTUsMjkuMjE1LTQuOTk3LDQzLjk2OC02LjE0czMxLjQ1NS0xLjcxMSw1MC4xMDktMS43MTFoNjMuOTUzdjczLjA5MWMwLDQuOTQ4LDEuODA3LDkuMjMyLDUuNDIxLDEyLjg0NyAgIGMzLjYyLDMuNjEzLDcuOTAxLDUuNDI0LDEyLjg0Nyw1LjQyNGM0Ljk0OCwwLDkuMjMyLTEuODExLDEyLjg1NC01LjQyNGwxNDYuMTc4LTE0Ni4xODNjMy42MTctMy42MTcsNS40MjQtNy44OTgsNS40MjQtMTIuODQ3ICAgQzUxMS42MjYsMTg2LjkyLDUwOS44MiwxODIuNjM2LDUwNi4yMDYsMTc5LjAxMnoiIGZpbGw9IiNlZDBhMGEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" />
										</button>
									</div>
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
								<Nav id="pills-tab">
									<Nav.Item>
										<Nav.Link eventKey="first">Order Online</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="third">Restaurant Info</Nav.Link>
									</Nav.Item>
								</Nav>
							</Col>
						</Row>
					</Container>
				</section>
				<section className="offer-dedicated-body pt-2 pb-2 mt-4 mb-4 fade-in">
					<Container>
						<Row>
							<Col md={8}>
								<div className="offer-dedicated-body-left">
									<Tab.Content className='h-100'>
										<Tab.Pane eventKey="first">
											<MealsContainer restaurantOffers={restaurantOffers} restaurant={restaurant} />
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
							<Cart restaurant={restaurant} />
						</Row>
					</Container>
				</section>
			</Tab.Container>
		</>
	);
}

export default Detail;
