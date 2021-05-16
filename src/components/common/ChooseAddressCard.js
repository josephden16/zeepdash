import React from 'react';
import { Card, Media } from 'react-bootstrap';
import { RiHome4Fill } from 'react-icons/ri';
import { BsBriefcaseFill } from 'react-icons/bs';
import { IoLocationSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';


const ChooseAddressCard = (props) => {
  const selectDeliveryLocation = () => {
    props.setDeliveryLocation(props.addressData);
    toast.info("Address selected");
  }

  return (
    <Card className={"bg-white addresses-item mb-4 " + (props.boxClass)}>
      <div className="gold-members p-4">
        <Media>
          <div className="mr-3">
            <Icon icon={props.icon} className={props.iconclassName} />
          </div>
          <div className="media-body">
            <h6 className="mb-1 text-secondary">{props.title}</h6>
            <p className="text-black lead">{props.address}
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

const Icon = ({ className, icon }) => {
  if (icon === 'home') {
    return (
      <RiHome4Fill className={className} />
    )
  }

  if (icon === 'briefcase') {
    return (
      <BsBriefcaseFill className={className} />
    )
  }

  if (icon === 'location') {
    return (
      <IoLocationSharp className={className} />
    )
  }

  return <IoLocationSharp className={className} />
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
