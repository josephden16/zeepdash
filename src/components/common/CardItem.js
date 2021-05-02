import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { AiFillClockCircle, AiFillStar } from 'react-icons/ai';

class CardItem extends React.Component {
	render() {
		return (
			<div className="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
				<div className="list-card-image">
					{this.props.rating ? (
						<div className="star position-absolute">
							<Badge variant="success">
								<AiFillStar /> {this.props.rating}
							</Badge>
						</div>
					)
						: ""
					}
					{this.props.showPromoted ? (
						<div className="member-plan position-absolute">
							<Badge variant={this.props.promotedVariant}>Promoted</Badge>
						</div>
					)
						: ""
					}
					<Link to={this.props.linkUrl}>
						<Image src={this.props.image} loading="lazy" style={{ height: '170px', width: '100%' }} draggable={false} className={this.props.imageClass} alt={this.props.imageAlt} />
					</Link>
				</div>
				<div className="p-3 position-relative">
					<div className="list-card-body">
						<h6 className="mb-1"><Link to={this.props.linkUrl} className="text-black">{this.props.title}</Link></h6>
						{this.props.subTitle ? (
							<p style={{fontSize: '11px'}} className="text-dark mb-3 mt-2">{this.props.subTitle}</p>
						)
							: ''
						}
						{(this.props.time || this.props.price) ? (
							<p className="text-gray mb-3 time">
								{this.props.time ? (
									<span className="bg-light text-dark rounded-sm pl-2 pb-1 pt-1 pr-2">
										<AiFillClockCircle /> {this.props.time}
									</span>
								)
									: ""
								}
								{this.props.price ? (
									<span className="float-right text-black-50"> {this.props.price}</span>
								)
									: ""
								}
							</p>
						) : ''
						}
					</div>
					{this.props.offerText ? (
						<div className="list-card-badge">
							<Badge variant={this.props.offerColor}>OFFER</Badge> <small>{this.props.offerText}</small>
						</div>
					)
						: ""
					}
				</div>
			</div>
		);
	}
}


CardItem.propTypes = {
	title: PropTypes.string.isRequired,
	imageAlt: PropTypes.string,
	image: PropTypes.string.isRequired,
	imageClass: PropTypes.string,
	linkUrl: PropTypes.string.isRequired,
	offerText: PropTypes.string,
	offerColor: PropTypes.string,
	subTitle: PropTypes.string,
	time: PropTypes.string,
	price: PropTypes.string,
	showPromoted: PropTypes.bool,
	promotedVariant: PropTypes.string,
	favIcoIconColor: PropTypes.string,
	rating: PropTypes.string,
};
CardItem.defaultProps = {
	imageAlt: '',
	imageClass: '',
	offerText: '',
	offerColor: 'success',
	subTitle: '',
	time: '',
	price: '',
	showPromoted: false,
	promotedVariant: 'dark',
	favIcoIconColor: '',
	rating: '',
}

export default CardItem;