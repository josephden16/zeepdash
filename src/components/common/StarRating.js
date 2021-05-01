import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AiFillStar } from 'react-icons/ai';

class StarRating extends Component {

  constructor(props) {
    super(props);
    this.state = { star: this.props.star || 0 };
  }

  handleClick(starValue) {
    if (!this.props.disabled) {
      this.setState({ star: starValue });

      this.props.getValue({ value: starValue });
    }
  }

  render() {
    return (
      <div style={{ "fontSize": this.props.fontSize ? this.props.fontSize : 14 }} className='d-inline-block'>
        <AiFillStar
          className={this.state.star >= 1 ? "text-primary" : "text-dark"}
          onClick={() => this.handleClick(1)}
        />
        <AiFillStar
          className={this.state.star >= 2 ? "text-primary" : "text-dark"}
          onClick={() => this.handleClick(2)}
        />
        <AiFillStar
          className={this.state.star >= 3 ? "text-primary" : "text-dark"}
          onClick={() => this.handleClick(3)}
        />
        <AiFillStar
          className={this.state.star >= 4 ? "text-primary" : "text-dark"}
          onClick={() => this.handleClick(4)}
        />
        <AiFillStar
          className={this.state.star >= 5 ? "text-primary" : "text-dark"}
          onClick={() => this.handleClick(5)}
        />
      </div>
    );
  }
}

StarRating.propTypes = {
  star: PropTypes.number,
  disabled: PropTypes.bool,
  fontSize: PropTypes.number,
  getValue: PropTypes.func.isRequired
};
StarRating.defaultProps = {
  star: 0,
  disabled: false
}

export default StarRating;