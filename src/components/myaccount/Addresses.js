import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Image, Form } from 'react-bootstrap';
import { v4 as uuid4 } from 'uuid';
import EditAddressModal from '../modals/EditAddressModal';
import DeleteAddressModal from '../modals/DeleteAddressModal';
import AddressCard from '../common/AddressCard';
import Loading from '../common/Loading';
import Seo from '../Seo';
import { UserContext } from '../providers/AuthProvider';
import { firestore } from '../../firebase';
import { toast } from 'react-toastify';


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
		const userRef = firestore.collection(collectionName).doc(userId);

		try {
			const snapshot = await userRef.get();
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
			const userRef = firestore.collection(collectionName).doc(userId);

			try {
				const snapshot = await userRef.get();
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
					<AddAddress refresh={fetchAddresses} user={user} addresses={addresses} />
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
				<h4 className="font-weight-bold mt-0 mb-3">Manage Addresses</h4>
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
			{
				addresses.length < 1 &&
				<Col md={12} className="h5">
					You don't have any address, fill the form above to create one.
				</Col>
			}
		</Row>
	)
}

const AddAddress = ({ refresh, addresses, user }) => {
	const [loading, setLoading] = useState(false);
	const [address, setAddress] = useState("");
	const [deliveryInstruction, setDeliveryInstruction] = useState("");
	const [deliveryArea, setDeliveryArea] = useState("");
	const [category, setCategory] = useState("");

	const addAddress = async () => {
		if (addresses && addresses.length === 3) {
			toast.info("You can't add more than 3 addresses");
			return;
		}
		if (address === "" && category === "" && deliveryArea && deliveryInstruction) {
			toast.warning("Please fill all form fields");
			return;
		}

		if (!address) {
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

		let id = uuid4();
		let data = {
			id: id,
			name: address,
			category: category,
			area: deliveryArea,
			deliveryInstruction: deliveryInstruction
		}
		let newLocations = addresses.concat(data);
		setLoading(true);
		try {
			const collectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
			const userRef = firestore.collection(collectionName).doc(user.id);
			await userRef.set({ locations: newLocations }, { merge: true });
			setLoading(false);
			toast.success("Address added");
			refresh();
		} catch (error) {
			toast.error("Failed to add address");
			setLoading(false);
		}
	}

	return (
		<>
			<div className="bg-white rounded p-0 mb-5">
				<h3 className="font-weight-bold mt-3 mb-2">Add a delivery location</h3>
				<div className="auth-animation">
					<Row>
						<Col md={9} lg={8}>
							<Form className="mt-2 mb-2" onSubmit={(evt) => { evt.preventDefault() }}>
								<div className="form-label-group">
									<input type="text" onChange={(evt) => setAddress(evt.target.value)} className="input" id="inputAddress" placeholder="Address" />
								</div>
								<div className="form-label-group">
									<input type="text" onChange={(evt) => setDeliveryArea(evt.target.value)} className="input" id="inputDeliveryArea" placeholder="Area" />
								</div>
								<div className="form-label-group">
									<input type="text" onChange={(evt) => setDeliveryInstruction(evt.target.value)} className="input" id="inputDeliveryInstruction" placeholder="Delivery Instruction" />
								</div>
								<div className="form-label-group flex flex-row">
									<Form.Control onChange={(evt) => setCategory(evt.target.value)} as="select">
										<option value="">Select a category...</option>
										<option value="home">Home</option>
										<option value="work">Work</option>
										<option value="other">Other</option>
									</Form.Control>
								</div>
								<button disabled={loading ? true : false} onClick={addAddress} className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2">
									{!loading && <span>Add Location</span>}
									{loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
								</button>
							</Form>
						</Col>
					</Row>
				</div>
			</div>
		</>
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
