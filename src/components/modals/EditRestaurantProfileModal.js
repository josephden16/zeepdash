import React, { useRef, useState } from 'react';
import { Form, Modal, Button, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { v4 as uuid4 } from 'uuid';
import { firestore, storage } from '../../firebase';
import { validatePhoneNumber } from '../../utils';



const EditProfileModal = (props) => {
  const imageFile = useRef(null);
  const [fileName, setFileName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = () => {
    const restaurantRef = firestore.collection("Restaurants").doc(props.restaurantId);

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      toast.warning("Please enter a valid phone number");
      return;
    }

    if (imageFile.current.files.length > 0) {
      const storageRef = storage.ref();
      const file = imageFile.current.files[0];
      const fileName = uuid4();
      const slug = props.slug;
      setLoading(true);
      storageRef
        .child("Restaurants")
        .child(slug)
        .child("Profile")
        .child(fileName)
        .put(file)
        .then(response => response.ref.getDownloadURL())
        .then(imageURL => {
          restaurantRef.set({
            phone: phoneNumber || props.defaultData.phone,
            photoURL: imageURL
          }, { merge: true })
            .then(() => {
              setLoading(false);
              window.location.reload();
            })
            .catch(() => {
              setLoading(false);
              toast.error("Update failed");
            })
        });
    } else {
      setLoading(true);
      restaurantRef.set({
        phone: phoneNumber,
      }, { merge: true })
        .then(() => {
          setLoading(false);
          window.location.reload();
        })
        .catch(() => {
          setLoading(false);
          toast.error("Update failed");
        })
    }
  }


  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="sm"
      centered
    >
      <Modal.Header closeButton={true}>
        <Modal.Title as='h5' id="edit-profile">Edit profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <div className="form-row">
            <Form.Group className="col-md-12">
              <Form.Label>Phone number</Form.Label>
              <Form.Control type="text" onChange={(evt) => setPhoneNumber(evt.target.value)} defaultValue={props.defaultData.phone} placeholder="Enter Phone number" />
            </Form.Group>
            <Form.Group className="col-md-12">
              <Form.Label>Restaurant Image</Form.Label>
              <Form.File
                id="custom-file"
                label={fileName || 'Attach Your Restaurant Image'}
                custom
                ref={imageFile}
                accept="image/*"
                onChange={() => setFileName(imageFile.current.files[0].name)}
              />
            </Form.Group>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type='button' onClick={props.onHide} variant="outline-primary" className="d-flex w-50 text-center justify-content-center">CANCEL</Button>
        <Button onClick={handleProfileUpdate} type='button' variant="primary" className='d-flex w-50 text-center justify-content-center'>
          {!loading && <span>UPDATE</span>}
          {loading && <Image style={{ width: '28px' }} fluid src="/img/loading-2.svg" alt="loading" />}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default EditProfileModal;
