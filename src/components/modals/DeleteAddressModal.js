import React, { useState } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { firestore } from '../../firebase';



const DeleteAddressModal = (props) => {
	const [loading, setLoading] = useState(false);

	const deleteAddress = async () => {
		const collectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
		const userRef = firestore.collection(collectionName).doc(props.user.id);
		setLoading(true);
		try {
			const newLocations = props.addresses.filter((location) => location.id !== props.defaultData.id);
			await userRef.set({ locations: newLocations }, { merge: true });
			toast.success("Address deleted");
			setLoading(false);
			props.refresh();
			props.onHide();
		} catch (error) {
			// console.log(error);
			setLoading(false);
			toast.error("Failed to delete address");
			props.onHide();
		}
		setLoading(false);
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
				<p className="mb-0 text-black">Are you sure you want to delete this address?</p>
			</Modal.Body>

			<Modal.Footer>
				<Button type='button' onClick={props.onHide} variant="outline-primary" className="d-flex w-50 text-center justify-content-center">CANCEL</Button>
				<Button disabled={loading ? true : false} onClick={deleteAddress} type='button' variant="primary" className='d-flex w-50 text-center justify-content-center'>
					{!loading && <span>DELETE</span>}
					{loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default DeleteAddressModal;
