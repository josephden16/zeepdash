import React, { useRef, useState } from 'react';
import { Form, Modal, Button, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { v4 as uuid4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase';
import { validatePhoneNumber } from '../../utils';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';



const EditProfileModal = (props) => {
  const profileImageFile = useRef(null);
  const backgroundImageFile = useRef(null);
  const [profilefileName, setProfileFileName] = useState("");
  const [backgroundFileName, setBackgroundFileName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = () => {
    const collectionName = process.env.NODE_ENV === 'production' ? 'Restaurants' : 'Restaurants_dev';
    const restaurantRef = doc(firestore, collectionName, props.restaurantId);

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      toast.warning("Please enter a valid phone number");
      return;
    }

    if (phoneNumber && validatePhoneNumber(phoneNumber)) {
      setLoading(true);
      setDoc(restaurantRef, {
        phone: phoneNumber,
      }, { merge: true })
        .then(() => {
          setLoading(false);
          toast.success("Update successful, please refresh this page to see changes");
        })
        .catch(() => {
          setLoading(false);
          toast.error("Update failed");
        })
    }

    if (profileImageFile.current.files.length > 0) {
      const storageRef = ref(storage);
      const file = profileImageFile.current.files[0];
      let [, extension] = file.name.split(".");
      const profileFileName = uuid4() + "-pp";
      const slug = props.slug;
      setLoading(true);
      const restaurantsStorageRef = ref(storageRef, "Restaurants");
      const restaurantStorageRef = ref(restaurantsStorageRef, slug);
      const profileStorageRef = ref(restaurantStorageRef, "Profile");
      const profileImageFileRef = ref(profileStorageRef, `${profileFileName}.${extension}`);
      uploadBytes(profileImageFileRef, file)
        .then(response => getDownloadURL(response.ref))
        .then(imageURL => {
          setDoc(restaurantRef, {
            photoURL: imageURL,
            profileFileName: profileFileName
          }, { merge: true })
            .then(() => {
              setLoading(false);
              toast.success("Update successful, please refresh this page to see changes");
            })
            .catch(() => {
              setLoading(false);
              toast.error("Update failed");
              props.onHide();
            })
        });
    }

    if (backgroundImageFile.current.files.length > 0) {
      const storageRef = ref(storage)``;
      const file = backgroundImageFile.current.files[0];
      let [, extension] = file.name.split(".");
      const bgFileName = uuid4() + "-bg";
      const slug = props.slug;
      setLoading(true);
      const restaurantsStorageRef = ref(storageRef, "Restaurants");
      const restaurantStorageRef = ref(restaurantsStorageRef, slug);
      const profileStorageRef = ref(restaurantStorageRef, "Profile");
      const bgImageFileRef = ref(profileStorageRef, `${bgFileName}.${extension}`);
      uploadBytes(bgImageFileRef, file)
        .then(response => getDownloadURL(response.ref))
        .then(imageURL => {
          setDoc(restaurantRef, {
            backgroundImageURL: imageURL,
            bgFileName: bgFileName
          }, { merge: true });
        }).then(() => {
          setLoading(false);
          toast.success("Update successful, please refresh this page to see changes");
        }).catch(() => {
          toast.error("Update failed");
          setLoading(false);
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
              <Form.Label>Restaurant Profile Image</Form.Label>
              <Form.File
                id="custom-file"
                label={profilefileName || 'Attach Your Restaurant Image'}
                custom
                ref={profileImageFile}
                accept="image/*"
                onChange={() => setProfileFileName(profileImageFile.current.files[0].name)}
              />
            </Form.Group>
            <Form.Group className="col-md-12">
              <Form.Label>Restaurant Background Image</Form.Label>
              <Form.File
                id="custom-file"
                label={backgroundFileName || 'Attach Your Background Image'}
                custom
                ref={backgroundImageFile}
                accept="image/*"
                onChange={() => setBackgroundFileName(backgroundImageFile.current.files[0].name)}
              />
            </Form.Group>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type='button' onClick={() => { props.onHide(); setLoading(false) }} variant="outline-primary" className="d-flex w-50 text-center justify-content-center">CANCEL</Button>
        <Button onClick={handleProfileUpdate} type='button' variant="primary" className='d-flex w-50 text-center justify-content-center'>
          {!loading && <span>UPDATE</span>}
          {loading && <Image style={{ width: '28px' }} fluid src="/img/loading-2.svg" alt="loading" />}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default EditProfileModal;
