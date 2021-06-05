import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { capitalize } from '../../utils';
import ProductBox from '../home/ProductBox';



const CuisinesCarousel = () => {
	const [cuisines, setCuisines] = useState(null);

	useEffect(() => {
		const fetchCuisines = async () => {
			const cusinesRef = collection(firestore, "Cuisines");
			const snapshot = await getDocs(cusinesRef);
			const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setCuisines(data);
		}

		fetchCuisines();
	}, []);
	if (!cuisines) return null;

	return (
		<div className="top-search">
			<OwlCarousel nav loop {...options} className="owl-carousel-category owl-theme">
				{
					cuisines && cuisines.map(cuisine => (
						<div key={cuisine.id} className="item">
							<ProductBox
								boxClass='osahan-category-item'
								title={capitalize(cuisine.name)}
								counting=''
								image={cuisine.imageURL}
								imageClass='img-fluid'
								imageAlt={cuisine.name}
								linkUrl={`/restaurants?cuisine=${cuisine.name}`}
							/>
						</div>
					))
				}
			</OwlCarousel>
		</div>
	);
}

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
	navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"]
}

export default CuisinesCarousel;
