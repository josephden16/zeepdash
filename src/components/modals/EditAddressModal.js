import React, { useState } from 'react';
import { Form, InputGroup, Modal, ButtonToolbar, Button, ToggleButton, Image, ToggleButtonGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { firestore } from '../../firebase';



const EditAddressModal = (props) => {
	const [loading, setLoading] = useState(false);
	const [address, setAddress] = useState("");
	const [deliveryInstruction, setDeliveryInstruction] = useState("");
	const [deliveryArea, setDeliveryArea] = useState("");
	const [category, setCategory] = useState("");


	const editAddress = async () => {
		if (address === "" && category === "" && deliveryArea && deliveryInstruction) {
			toast.warning("Please fill all form fields");
			return;
		}

		if (!address) {
			// console.log(address);
			toast.warning("Please enter a valid address");
			return;
		}

		if (!deliveryArea) {
			toast.warning("Please enter the area you stay");
			return;
		}

		if (!deliveryInstruction) {
			toast.warning("Please enter a delivery instruction");
			return;
		}

		if (category === "") {
			toast.warning("Please select a category");
			return;
		}

		let data = {
			id: props.defaultData.id,
			name: address,
			category: category,
			area: deliveryArea,
			deliveryInstruction: deliveryInstruction
		}
		let newLocations = props.addresses.filter((location) => location.id !== props.defaultData.id);
		newLocations = newLocations.concat(data);
		setLoading(true);
		try {
			const collectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
			const userRef = firestore.collection(collectionName).doc(props.user.id);
			await userRef.set({ locations: newLocations }, { merge: true });
			setLoading(false);
			toast.success("Address edited");
			props.refresh();
			props.onHide();
		} catch (error) {
			toast.error("Failed to edit address");
			setLoading(false);
		}
	}

	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			centered
		>
			<Modal.Header closeButton={true}>
				<Modal.Title as='h5' id="add-address">Edit Delivery Address</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form>
					<div className="form-row">
						<Form.Group className="col-md-12">
							<Form.Label>Delivery Area</Form.Label>
							<InputGroup>
								<Form.Control type="text" onChange={(evt) => setDeliveryArea(evt.target.value)}  placeholder="Delivery Area" />
							</InputGroup>
						</Form.Group>
						<Form.Group className="col-md-12">
							<Form.Label>Complete Address</Form.Label>
							<Form.Control type="text" onChange={(evt) => setAddress(evt.target.value)}  placeholder="Complete Address e.g. house number, street name, landmark" />
						</Form.Group>
						<Form.Group className="col-md-12">
							<Form.Label>Delivery Instructions</Form.Label>
							<Form.Control type="text" onChange={(evt) => setDeliveryInstruction(evt.target.value)}  placeholder="Delivery Instructions e.g. Opposite Gold Souk Mall" />
						</Form.Group>
						<Form.Group className="mb-0 col-md-12">
							<Form.Label>Category</Form.Label>
							<ButtonToolbar>
								<ToggleButtonGroup className="d-flex w-100" type="radio" name="options">
									<ToggleButton variant='info' onClick={(evt) => setCategory(evt.target.value)} value={"home"}>
										Home
									</ToggleButton>
									<ToggleButton variant='info' onClick={(evt) => setCategory(evt.target.value)} value={"work"}>
										Work
									</ToggleButton>
									<ToggleButton variant='info' onClick={(evt) => setCategory(evt.target.value)} value={"other"}>
										Other
									</ToggleButton>
								</ToggleButtonGroup>
							</ButtonToolbar>
						</Form.Group>
					</div>
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button type='button' onClick={props.onHide} variant="outline-primary" className="d-flex w-50 text-center justify-content-center">CANCEL</Button>
				<Button disabled={loading ? true : false} type='button' onClick={editAddress} variant="primary" className='d-flex w-50 text-center justify-content-center'>
					{!loading && <span>SUBMIT</span>}
					{loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default EditAddressModal;
