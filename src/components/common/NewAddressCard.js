import React, { useContext } from 'react';
import { Card, Media } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../providers/AuthProvider';


const NewAddressCard = (props) => {
  const user = useContext(UserContext);
  const history = useHistory();

  const { locations } = user;

  const handleClick = (evt) => {
    evt.preventDefault();

    if (!user) {
      toast.error("You must be signed in to save a new location");
      return;
    }

    if (locations.length === 3) {
      toast.info("You can't add more than 3 addresses");
      return;
    }
  
    history.push("/add-location");
  }

  return (
    <Card className={"bg-white addresses-item mb-4 " + (props.boxClass)}>
      <div className="gold-members p-4">
        <Media>
          <div className="media-body">
            <p className="mb-0 text-black text-center font-weight-bold">
              <Link onClick={handleClick} to="/add-location" className="btn btn-sm btn-info mr-2">ADD NEW ADDRESS</Link>
            </p>
          </div>
        </Media>
      </div>
    </Card>
  )
}

export default NewAddressCard;
