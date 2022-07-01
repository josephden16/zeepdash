import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Container, Tab, Nav, Image, Button } from "react-bootstrap";
import Seo from "./Seo";
import NotFound from "./NotFound";
import GalleryCarousel from "./common/GalleryCarousel";
import { FiNavigation } from "react-icons/fi";
import { IoFastFood } from "react-icons/io5";
import { BsClockFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { firestore } from "../firebase";
import { collection, query, where, getDocs } from "@firebase/firestore";
import {
  MealsContainer,
  Cart,
  RestaurantOpenStatus,
  RestaurantInfoTab,
} from "./detail";
import ScreenLoader from "./common/ScreenLoader";

const Detail = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantOffers, setRestaurantOffers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    const collectionName =
      process.env.NODE_ENV === "production" ? "Restaurants" : "Restaurants_dev";
    const mealsCollectionName =
      process.env.NODE_ENV === "production" ? "Meals" : "Meals_dev";
    const restaurantRef = collection(firestore, collectionName);
    const offersRef = collection(firestore, mealsCollectionName);
    const restaurantQuery = query(restaurantRef, where("slug", "==", slug));
    const offersQuery = query(offersRef, where("restaurantSlug", "==", slug));

    const fetchRestaurantData = async () => {
      setLoading(true);

      try {
        const restaurantSnapshot = await getDocs(restaurantQuery);

        if (!restaurantSnapshot.empty) {
          // fetch restaurant data
          const data = restaurantSnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
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
    };

    const fetchRestaurantOffers = async () => {
      try {
        const offersSnapshot = await getDocs(offersQuery);
        if (!offersSnapshot.empty) {
          const offers = offersSnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
          setRestaurantOffers(offers);
        }
      } catch (error) {
        toast.error("Failed to fetch offers");
      }
    };

    fetchRestaurantData();
    fetchRestaurantOffers();
  }, [slug]);

  if (!slug) {
    return <NotFound />;
  }

  if (loading && notFound === false) return <ScreenLoader />;

  if (notFound) return <NotFound />;

  if (!restaurant) {
    return null;
  }

  const seo = {
    metaTitle: `${restaurant.name}` || "",
    metaDescription: `Welcome to the page of ${restaurant.name}` || "",
  };
  // share page with the Native Share API
  return (
    <>
      <Seo seo={seo} />
      <section className="restaurant-detailed-banner">
        <div className="text-center">
          <Image
            fluid
            className="cover restaurant-detail-bg"
            draggable={false}
            alt={restaurant.name}
            style={{ width: "100%", objectFit: "fill" }}
            src={restaurant.backgroundImageURL || "/img/restaurant-bg.webp"}
          />
        </div>
        <div className="restaurant-detailed-header">
          <Container>
            <Row className="d-flex align-items-end">
              <Col md={8}>
                <div className="restaurant-detailed-header-left">
                  <Image
                    draggable={false}
                    fluid
                    className="mr-3 float-left"
                    alt="osahan"
                    src={restaurant.photoURL || "/img/1.jpg"}
                  />
                  <h4 className="text-white">{restaurant.name}</h4>
                  <p className="text-white mb-1">
                    <FiNavigation /> {restaurant.address.toUpperCase()}{" "}
                    <RestaurantOpenStatus
                      openingTime={restaurant.openingTime}
                      closingTime={restaurant.closingTime}
                    />
                  </p>
                  <p className="text-white mb-0">
                    <IoFastFood />{" "}
                    {restaurant.cuisines.join(" , ").toUpperCase()}
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="restaurant-detailed-header-right text-right mt-2">
                  <Button
                    variant="secondary"
                    style={{ fontSize: "14px" }}
                    type="button"
                  >
                    <BsClockFill style={{ marginRight: "3px" }} />{" "}
                    <span>
                      {restaurant.openingTime} - {restaurant.closingTime}
                    </span>
                  </Button>
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
                  <Tab.Content className="h-100">
                    <Tab.Pane eventKey="first">
                      <MealsContainer
                        restaurantOffers={restaurantOffers}
                        restaurant={restaurant}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <div className="position-relative">
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
};

export default Detail;
