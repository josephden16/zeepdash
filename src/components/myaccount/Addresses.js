import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import AddAddressModal from '../modals/AddAddressModal';
import DeleteAddressModal from '../modals/DeleteAddressModal';
import AddressCard from '../common/AddressCard';

const Addresses = () => {
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const hideAddressModal = () => setShowAddressModal(false);

	const hideDeleteModal = () => setShowDeleteModal(false);


	return (
		<>
			<AddAddressModal show={showAddressModal} onHide={hideAddressModal} />
			<DeleteAddressModal show={showDeleteModal} onHide={hideDeleteModal} />
			<div className='p-4 bg-white shadow-sm'>
				<Row>
					<Col md={12}>
						<h4 className="font-weight-bold mt-0 mb-3">Manage Addresses</h4>
					</Col>
					<Col md={6}>
						<AddressCard
							boxClass="border border-primary shadow"
							title='Home'
							icoIcon='ui-home'
							iconclassName='icofont-3x'
							address='Osahan House, Jawaddi Kalan, Ludhiana, Punjab 141002, India'
							onEditClick={() => setShowAddressModal(true)}
							onDeleteClick={() => setShowAddressModal(true)}
						/>
					</Col>
					<Col md={6}>
						<AddressCard
							boxClass="shadow-sm"
							title='Work'
							icoIcon='briefcase'
							iconclassName='icofont-3x'
							address='NCC, Model Town Rd, Pritm Nagar, Model Town, Ludhiana, Punjab 141002, India'
							onEditClick={() => setShowAddressModal(true)}
							onDeleteClick={() => setShowDeleteModal(true)}
						/>
					</Col>
				</Row>
			</div>
		</>
	)
}

export default Addresses;
