import React, { useState } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { storage, firestore } from '../../firebase';


const DeleteMealModal = (props) => {
  const [loading, setLoading] = useState(false);

  const deleteMeal = async () => {
    if (!(props.deleteMealData)) {
      toast.error("Failed to delete meal");
      return;
    }

    const mealId = props.deleteMealData.id;
    const restaurantId = props.deleteMealData.restaurantId;
    const imageFile = props.deleteMealData.mealImageFile;
    const mealRef = firestore.collection("Meals").doc(mealId);
    const storageRef = storage.ref();
    setLoading(true);
    try {
      // delete meal document in firestore
      mealRef.delete();
      await storageRef.child("Meals").child(restaurantId).child(imageFile).delete();
      setLoading(false)
      toast.success("Meal deleted");
      // props.onHide();
    } catch (error) {
      console.log(error.message);
      setLoading(false)
      toast.error("Failed to delete meal");
    }
    props.onHide();
    props.refresh();
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      centered
      size="sm"
    >
      <Modal.Header closeButton={true}>
        <Modal.Title as='h5' id="delete-address">Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-0 text-black">Are you sure you want to delete this meal?</p>
      </Modal.Body>

      <Modal.Footer>
        <Button type='button' onClick={props.onHide} variant="outline-primary" className="d-flex w-50 text-center justify-content-center">CANCEL</Button>
        <Button onClick={deleteMeal} type='button' variant="primary" className='d-flex w-50 text-center justify-content-center'>
          {!loading && <span>DELETE</span>}
          {loading && <Image style={{ width: '28px' }} fluid src="/img/loading-2.svg" alt="loading" />}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteMealModal;
