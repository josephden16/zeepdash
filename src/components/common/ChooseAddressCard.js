import React from 'react';
import { Card, Media } from 'react-bootstrap';
import Icofont from 'react-icofont';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';


const ChooseAddressCard = (props) => {
  const selectDeliveryLocation = () => {
    props.setDeliveryLocation(props.addressData);
    toast.info("Address selected");
  }

  return (
    <Card className={"bg-white addresses-item mb-4 " + (props.boxClass)}>
      <div className="gold-members p-4">
        <Media>
          <div className="mr-3"><Icofont icon={props.icoIcon} className={props.iconclassName} /></div>
          <div className="media-body">
            <h6 className="mb-1 text-secondary">{props.title}</h6>
            <p className="text-black">{props.address}
            </p>
            <p className="mb-0 text-black font-weight-bold">
              <button onClick={selectDeliveryLocation} className="btn btn-sm btn-success mr-2">DELIVER HERE</button>
            </p>
          </div>
        </Media>
      </div>
    </Card>
  )
}

ChooseAddressCard.propTypes = {
  title: PropTypes.string.isRequired,
  icoIcon: PropTypes.string.isRequired,
  iconclassName: PropTypes.string,
  address: PropTypes.string,
  onDeliverHere: PropTypes.func,
  onAddNewClick: PropTypes.func,
  type: PropTypes.string.isRequired
};

ChooseAddressCard.defaultProps = {
  type: 'hasAddress'
}


export default ChooseAddressCard;
