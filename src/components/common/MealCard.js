import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Media, Image } from 'react-bootstrap';
import Icofont from 'react-icofont';
import PropTypes from 'prop-types';

class MealCard extends React.Component {

  render() {
    return (
      <Card className={"bg-white pr-2 addresses-item mb-4 w-100 " + (this.props.boxClass)}>
        <div className="gold-members p-0">
          <Media>
            <Image fluid src={this.props.mealImage} style={{height: '150px'}} className={"mr-3 rounded-sm " + this.props.imageclassName} />
            <Media.Body className="align-self-center">
              <h6 style={{fontSize: '14px'}} className="mb-1 text-secondary">{this.props.mealName}</h6>
              <p className="text-black">&#8358;{this.props.price}</p>
              <small className="mb-0 text-black font-weight-bold flex">
                <Link className="text-primary mr-3" to="#" onClick={this.props.onEditClick}><Icofont icon="ui-edit" /> EDIT</Link>
                <Link className="text-danger" to="#" onClick={this.props.onDeleteClick}><Icofont icon="ui-delete" /> DELETE</Link>
              </small>
            </Media.Body>
          </Media>
        </div>
      </Card>
    );
  }
}

MealCard.propTypes = {
  mealName: PropTypes.string,
  mealImage: PropTypes.string.isRequired,
  mealImageclassName: PropTypes.string,
  price: PropTypes.number.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

export default MealCard;
