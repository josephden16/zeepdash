import React from "react";
import OwlCarousel from "react-owl-carousel";
import { capitalize } from "../../utils";
import ProductBox from "../home/ProductBox";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "owl.carousel/dist/assets/owl.carousel.css";

const CuisinesCarousel = ({ cuisines }) => {
  // if (!cuisines) return null;
  return (
    <div className="top-search">
      <OwlCarousel
        nav
        loop
        {...options}
        className="owl-carousel-category owl-theme"
      >
        {cuisines &&
          cuisines.map((cuisine) => (
            <div key={cuisine.name} className="item">
              <ProductBox
                boxClass="osahan-category-item"
                title={capitalize(cuisine.name)}
                counting=""
                image={cuisine.imageURL}
                imageClass="img-fluid"
                imageAlt={cuisine.name}
                linkUrl={`/restaurants?cuisine=${cuisine.name}`}
              />
            </div>
          ))}
      </OwlCarousel>
    </div>
  );
};

const options = {
  responsive: {
    0: {
      items: 3,
    },
    600: {
      items: 4,
    },
    1000: {
      items: 6,
    },
    1200: {
      items: 8,
    },
  },
  loop: true,
  lazyLoad: true,
  autoplay: true,
  dots: false,
  autoplaySpeed: 1000,
  autoplayTimeout: 2000,
  autoplayHoverPause: true,
  nav: true,
  navText: [
    "<i class='fa fa-chevron-left'></i>",
    "<i class='fa fa-chevron-right'></i>",
  ],
};

export default CuisinesCarousel;
