import React, { useState, useContext, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import EditAddressModal from '../modals/EditAddressModal';
import DeleteAddressModal from '../modals/DeleteAddressModal';
import NewAddressCard from "../common/NewAddressCard";
import AddressCard from '../common/AddressCard';
import Loading from '../common/Loading';
import Seo from '../Seo';
import { UserContext } from '../providers/AuthProvider';
import { firestore } from '../../firebase';
import { doc, getDoc } from '@firebase/firestore';


const Addresses = () => {
	const user = useContext(UserContext);
	const userId = user.id;
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [addresses, setAddresses] = useState(null);
	const [failedDataFetch, setFailedDataFetch] = useState(false);


	const defaultData = {
		id: '',
		name: '',
		category: '',
		deliveryInstruction: '',
		deliveryArea: ''
	}

	const defaultDeleteData = {
		id: '',
		name: ''
	}


	const [editAddressData, setEditAddressData] = useState(defaultData);
	const [deleteAddressData, setDeleteAddressData] = useState(defaultDeleteData)

	const hideAddressModal = () => setShowAddressModal(false);

	const hideDeleteModal = () => setShowDeleteModal(false);


	const fetchAddresses = async () => {
		const collectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
		const userRef = doc(firestore, collectionName, userId);

		try {
			const snapshot = await getDoc(userRef);
			if (snapshot.exists) {
				let data = snapshot.data();
				let { locations } = data;
				if (locations.length > 0) {
					setAddresses(locations);
					setFailedDataFetch(false);
				} else {
					setAddresses([]);
				}
			} else {
				setAddresses(null);
				setFailedDataFetch(false);
			}

		} catch (error) {
			setFailedDataFetch(true);
		}
	}

	const displayEditAddressModal = (address) => {
		let data = {
			id: address.id,
			name: address.name,
			cateogry: address.category,
			area: address.area,
			deliveryInstruction: address.deliveryInstruction
		}
		// console.log(data);
		setEditAddressData(data);
		setShowAddressModal(true);
	}

	const displayDeleteAddressModal = (address) => {
		let data = {
			id: address.id,
		}

		setDeleteAddressData(data);
		setShowDeleteModal(true);
	}

	useEffect(() => {
		const fetchAddresses = async () => {
			const collectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
			const userRef = doc(firestore, collectionName, userId);
			try {
				const snapshot = await getDoc(userRef);
				if (snapshot.exists) {
					let data = snapshot.data();
					let { locations } = data;
					if (locations.length > 0) {
						setAddresses(locations);
						setFailedDataFetch(false);
					} else {
						setAddresses([]);
						setFailedDataFetch(false);
					}
				} else {
					setAddresses([]);
					setFailedDataFetch(false);
				}
			} catch (error) {
				setFailedDataFetch(true);
			}
		}
		fetchAddresses();
	}, [userId]);


	const seo = {
		metaTitle: 'Your Delivery Addresses | ZeepDash',
		metaDescription: 'Manage your delivery addresses on ZeepDash'
	}


	return (
		<>
			<Seo seo={seo} />
			<EditAddressModal refresh={fetchAddresses} user={user} addresses={addresses} defaultData={editAddressData} show={showAddressModal} onHide={hideAddressModal} />
			<DeleteAddressModal refresh={fetchAddresses} user={user} addresses={addresses} defaultData={deleteAddressData} show={showDeleteModal} onHide={hideDeleteModal} />
			{(!addresses && failedDataFetch === true) && <FailedToFetch />}
			{(!addresses) && <Loading text="Fetching addresses..." />}
			{addresses &&
				<div className='p-4 bg-white shadow-sm'>
					{/* <AddAddress refresh={fetchAddresses} user={user} addresses={addresses} /> */}
					<AddressesContainer user={user} addresses={addresses} displayEditAddressModal={displayEditAddressModal} displayDeleteAddressModal={displayDeleteAddressModal} />
				</div>
			}
		</>
	)
}

const AddressesContainer = ({ displayEditAddressModal, displayDeleteAddressModal, addresses }) => {
	return (
		<Row>
			<Col md={12}>
				<h4 className="font-weight-bold mt-0 mb-4 text-center">Manage Addresses</h4>
			</Col>
			{addresses && addresses.map(address => {
				let iconName = "";
				switch (address.category) {
					case "home":
						iconName = "home";
						break;
					case "work":
						iconName = "briefcase";
						break;
					default:
						iconName = "location";
						break;
				}
				return (
					<Col md={6} key={address.id}>
						<AddressCard
							boxClass="shadow-sm"
							title='Home'
							icon={iconName}
							iconclassName='h1'
							address={address.name}
							onEditClick={() => displayEditAddressModal(address)}
							onDeleteClick={() => displayDeleteAddressModal(address)}
						/>
					</Col>
				)
			})}
			<Col md={6}>
				<NewAddressCard
					iconclassName='h1'
				/>
			</Col>
		</Row>
	)
}

const FailedToFetch = () => {
	return (
		<div style={{ fontSize: '17px' }} className="bg-white text-center pt-5 pb-5">
			Failed to fetch addresses.
		</div>
	)
}


export default Addresses;
