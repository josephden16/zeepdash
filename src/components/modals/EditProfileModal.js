import React from 'react';
import { Form, Modal, Button } from 'react-bootstrap';



const EditProfileModal = (props) => {
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
							<Form.Control type="text" defaultValue={props.defaultData.phone} placeholder="Enter Phone number" />
						</Form.Group>
						<Form.Group className="col-md-12">
							<Form.Label>Email id</Form.Label>
							<Form.Control type="text" defaultValue={props.defaultData.email} placeholder="Enter Email id" />
						</Form.Group>
						<Form.Group className="col-md-12 mb-0">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" defaultValue="**********" placeholder="Enter password" />
						</Form.Group>
					</div>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button type='button' onClick={props.onHide} variant="outline-primary" className="d-flex w-50 text-center justify-content-center">CANCEL</Button>
				<Button type='button' variant="primary" className='d-flex w-50 text-center justify-content-center'>UPDTAE</Button>
			</Modal.Footer>
		</Modal>
	);
}
export default EditProfileModal;