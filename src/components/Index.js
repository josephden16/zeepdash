import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCuisines, useRestaurants } from "../api/hooks/home";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import TopSearch from "./home/TopSearch";
import CardItem from "./common/CardItem";
import SectionHeading from "./common/SectionHeading";
import FontAwesome from "./common/FontAwesome";
import Seo from "./Seo";
import ScreenLoader from "./common/ScreenLoader";

const seo = {
  metaTitle: "Home | ZeepDash",
  metaDescription:
    "ZeepDash is an awesome website to get meals delivered to you from restaurants near by",
};

const Index = () => {
  const cuisines = useCuisines();
  const restaurants = useRestaurants();

  if (cuisines.isLoading || restaurants.isLoading) return <ScreenLoader />;

  return (
    <>
      <Seo seo={seo} />
      <TopSearch cuisines={cuisines.data} />
      <section className="section pt-5 pb-5 products-section">
        <Container>
          <SectionHeading
            heading="Popular Brands"
            subHeading="Top restaurants, cafes"
          />
          <Row>
            <Col md={12}>
              <RestaurantsCarousel restaurants={restaurants.data} />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section pt-5 pb-5 bg-white becomemember-section border-bottom">
        <Container>
          <SectionHeading
            heading="Become a Member"
            subHeading="Sign up and get access to excellent meals near you"
          />
          <Row>
            <Col sm={12} className="text-center">
              <Link to="register" className="btn btn-success btn-lg">
                Create an Account <FontAwesome icon="chevron-circle-right" />
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

const RestaurantsCarousel = ({ restaurants }) => {
  if (!restaurants) return null;

  return (
    <OwlCarousel nav {...options} className="owl-carousel-four owl-theme">
      {!restaurants && null}
      {restaurants &&
        restaurants.map((restaurant) => (
          <div key={restaurant.id} className="item">
            <CardItem
              title={restaurant.name}
              subTitle={restaurant.cuisines.join(" • ").toUpperCase()}
              imageAlt={restaurant.name}
              image={restaurant.photoURL || "img/default-list.webp"}
              imageClass="img-fluid item-img"
              linkUrl={`/restaurant/${restaurant.slug}`}
              offerText=""
              time=""
              price=""
              showPromoted={false}
              promotedVariant="dark"
              favIcoIconColor="text-danger"
              rating=""
            />
          </div>
        ))}
    </OwlCarousel>
  );
};

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
  navText: [
    "<i class='fa fa-chevron-left'></i>",
    "<i class='fa fa-chevron-right'></i>",
  ],
};

export default Index;
