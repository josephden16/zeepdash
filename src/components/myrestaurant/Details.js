import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Form, Image } from 'react-bootstrap';
import Seo from '../Seo';
import { capitalize } from '../../utils';
import { firestore } from '../../firebase';
import { toast } from 'react-toastify';
import { UserContext } from '../providers/AuthProvider';

const seo = {
  metaTitle: 'My Restaurant | ZeepDash',
  metaDescription: 'Manage your restaurant details on ZeepDash'
}



const Details = () => {
  const [loading, setLoading] = useState(false);
  const [defaultCuisines, setDefaultCuisines] = useState(null);
  const restaurant = useContext(UserContext);
  const [cuisines, setCuisines] = useState(restaurant.cuisines);

  useEffect(() => {
    const fetchCuisines = async () => {
      const cuisinesRef = firestore.collection("Cuisines");
      try {
        const snapshot = await cuisinesRef.get();
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDefaultCuisines(data);
        } else {
          setDefaultCuisines(null);
        }
      } catch (err) {
        toast.error("Failed to fetch cuisines");
      }
    }

    fetchCuisines();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    if (cuisines.length > 0) {
      const collectionName = process.env.NODE_ENV === 'production' ? 'Restaurants' : 'Restaurants_dev';
      const restaurantId = restaurant.id;
      const restaurantRef = firestore.collection(collectionName).doc(restaurantId);
      try {
        await restaurantRef.set({ cuisines: cuisines }, { merge: true });
        toast.success("Update successful");
      } catch (err) {
        toast.error("Failed to update");
        setLoading(false);
      }
    } else {
      toast.warning("You must select at least one cuisine");
    }
    setLoading(false);
  }

  return (
    <>
      <Seo seo={seo} />
      <div className='p-4 bg-white shadow-sm'>
        <Row className="mb-5">
          <Col>
            <h3 className="font-weight-bold mt-3 mb-5">Update Restaurant Info</h3>
            <div className="auth-animation">
              <Row>
                <Col md={9} lg={8}>
                  <Form onSubmit={(evt) => { evt.preventDefault() }}>
                    <SelectCuisines restaurant={restaurant} cuisines={cuisines} updateCuisines={setCuisines} defaultCuisines={defaultCuisines} />
                    <button onClick={handleUpdate} disabled={loading ? true : false} className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2">
                      {!loading && <span>UPDATE</span>}
                      {loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
                    </button>
                  </Form>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}


const SelectCuisines = ({ defaultCuisines, restaurant, cuisines, updateCuisines }) => {

  if (!(defaultCuisines && restaurant)) return null;

  const setCuisines = (cuisine) => {
    if (!cuisines.includes(cuisine)) {
      let selectedCuisines = cuisines;
      selectedCuisines = cuisines.concat(cuisine);
      updateCuisines(selectedCuisines);
    } else {
      let selectedCuisines = cuisines.filter(item => cuisine !== item);
      updateCuisines(selectedCuisines);
    }
  }

  return (
    <div className="form-label-group">
      <p className="text-black h6 mb-3">Select the cuisines you offer</p>
      {defaultCuisines && defaultCuisines.map((cuisine, index) => (
        <Form.Check
          key={cuisine.id}
          custom
          checked={cuisines.includes(cuisine.name) ? true : false}
          type='checkbox'
          id={`custom-cb${index + 1}`}
          value={cuisine.name}
          onChange={(evt) => setCuisines(evt.target.value)}
          label={capitalize(cuisine.name)}
        />
      ))}
    </div>
  )
}

export default Details;
