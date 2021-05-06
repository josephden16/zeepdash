import React, { useState } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { storage, firestore } from '../../firebase';
import { ref, deleteObject } from 'firebase/storage';
import { doc, deleteDoc } from 'firebase/firestore';


const DeleteMealModal = (props) => {
  const [loading, setLoading] = useState(false);

  const deleteMeal = async () => {
    if (!(props.deleteMealData)) {
      toast.error("Failed to delete meal");
      return;
    }

    const mealId = props.deleteMealData.id;
    const restaurantSlug = props.deleteMealData.slug;
    const imageFile = props.deleteMealData.fileName;
    const mealsCollectionName = process.env.NODE_ENV === 'production' ? 'Meals' : 'Meals_dev';
    const mealRef = doc(firestore, mealsCollectionName, mealId);
    const storageRef = ref(storage);
    setLoading(true);
    try {
      const mealsDirectoryName = process.env.NODE_ENV === 'production' ? 'Meals' : 'Meals_dev';
      // delete meal document in firestore
      await deleteDoc(mealRef);
      const mealStorageRef = ref(storageRef, mealsDirectoryName);
      const restaurantStorageRef = ref(mealStorageRef, restaurantSlug);
      const mealImageRef = ref(restaurantStorageRef, `${imageFile}.webp`);
      await deleteObject(mealImageRef);
      setLoading(false)
      toast.success("Meal deleted");
      // props.onHide();
    } catch (error) {
      // console.log(error.message);
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
