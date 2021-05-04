import React, { useState, useRef } from 'react';
import { Form, Modal, Button, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { firestore, storage } from '../../firebase';


const EditMealModal = (props) => {
  const [mealName, setMealName] = useState(props.defaultData.name);
  const [mealPrice, setMealPrice] = useState(props.defaultData.price);
  const [mealFileName, setMealFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  let mealImageFileRef = useRef(null);
  //TODO: delete old meal image after updating new one
  const updateMeal = () => {
    const mealId = props.defaultData.id;
    const mealsCollectionName = process.env.NODE_ENV === 'production' ? 'Meals' : 'Meals_dev'; 
    const mealsRef = firestore.collection(mealsCollectionName).doc(mealId);
    const storageRef = storage.ref();
    const restaurantSlug = props.defaultData.restaurantSlug;

    setLoading(true);
    if (mealImageFileRef.current.files.length > 0) {
      const imageFile = mealImageFileRef.current.files[0];
      let [, extension] = imageFile.name.split(".");
      // generate a random file name
      const fileName = uuidv4();
      storageRef
        .child("Meals")
        .child(restaurantSlug)
        .child(`${fileName}.${extension}`)
        .put(imageFile)
        .then(response => response.ref.getDownloadURL())
        .then(imageURL => {
          mealsRef.set({
            name: mealName || props.defaultData.name,
            price: parseInt(mealPrice) || parseInt(props.defaultData.price),
            fileName: fileName,
            imageURL: imageURL,
          }, { merge: true })
            .then(() => {
              props.refresh();
              toast.success("Meal updated successfuly 🎉");
              setLoading(false);
            })
        })
        .catch(() => {
          toast.error("Failed to update meal");
          setLoading(false);
        });
    } else {
      mealsRef.set({
        name: mealName || props.defaultData.name,
        price: parseInt(mealPrice) || parseInt(props.defaultData.price),
      }, { merge: true })
        .then(() => {
          props.refresh();
          toast.success("Meal updated successfuly 🎉");
          setLoading(false);
        })
    }
  }

  const closeModal = () => {
    mealImageFileRef.current.remove();
    setMealFileName('');
    props.onHide();
  }

  return (
    <Modal
      show={props.show}
      onHide={closeModal}
      size="sm"
      centered
    >
      <Modal.Header closeButton={true}>
        <Modal.Title as='h5' id="edit-profile">Edit meal</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <div className="form-row">
            <Form.Group className="col-md-12">
              <Form.Label>Meal name</Form.Label>
              <Form.Control type="text" onChange={(evt) => setMealName(evt.target.value)} defaultValue={props.defaultData.name} placeholder="Enter meal name" />
            </Form.Group>
            <Form.Group className="col-md-12">
              <Form.Label>Meal Price</Form.Label>
              <Form.Control type="text" onChange={(evt) => setMealPrice(evt.target.value)} defaultValue={props.defaultData.price} placeholder="Enter meal price" />
            </Form.Group>
            <Form.Group className="col-md-12">
              <Form.Label>Meal Image</Form.Label>
              <Form.File
                id="custom-file"
                label={mealFileName || 'Attach Meal Image'}
                custom
                ref={mealImageFileRef}
                accept="image/*"
                onChange={() => setMealFileName(mealImageFileRef.current.files[0].name)}
              />
            </Form.Group>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type='button' onClick={props.onHide} variant="outline-primary" className="d-flex w-50 text-center justify-content-center">CANCEL</Button>
        <Button disabled={loading ? true : false} type='button' onClick={updateMeal} variant="primary" className='d-flex w-50 text-center justify-content-center'>
          {!loading && <span>UPDATE</span>}
          {loading && <Image style={{ width: '28px' }} fluid src="/img/loading-2.svg" alt="loading" />}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditMealModal;
