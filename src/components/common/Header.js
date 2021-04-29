import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Image } from 'react-bootstrap';
import DropDownTitle from '../common/DropDownTitle';
import Icofont from 'react-icofont';
import { UserContext } from '../providers/AuthProvider';
import { signOut } from '../../firebase';


class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isNavExpanded: false
		};
	}
	setIsNavExpanded = (isNavExpanded) => {
		this.setState({ isNavExpanded: isNavExpanded });
	}
	closeMenu = () => {
		this.setState({ isNavExpanded: false });
	}

	handleClick = (e) => {
		if (this.node.contains(e.target)) {
			// if clicked inside menu do something
		} else {
			// If clicked outside menu, close the navbar.
			this.setState({ isNavExpanded: false });
		}
	}

	componentDidMount() {
		document.addEventListener('click', this.handleClick, false);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClick, false);
	}
	render() {
		return (
			<div ref={node => this.node = node}>
				<Navbar onToggle={this.setIsNavExpanded}
					expanded={this.state.isNavExpanded} color="light" expand='lg' className="navbar-light osahan-nav shadow-sm">
					<Container>
						<Navbar.Brand to="/"><Link to="/"><Image draggable={false} style={{ width: '170px' }} src="/img/logo-2.png" alt='ZeepDash' /></Link></Navbar.Brand>
						<Navbar.Toggle style={{ outline: 'none' }} className="bg-white" />
						<Navbar.Collapse id="navbarNavDropdown">
							<Nav activeKey={0} className="ml-auto" onSelect={this.closeMenu}>
								<Nav.Link eventKey={0} as={NavLink} activeclassname="active" to="/">
									Home <span className="sr-only">(current)</span>
								</Nav.Link>
								<RestaurantLink />
								<UserDropDown />
								{/* <Nav.Link eventKey={1} as={NavLink} activeclassname="active" to="/offers">
									<Icofont icon='sale-discount' /> Offers <Badge variant="danger">New</Badge>
								</Nav.Link> */}
								{/* <NavDropdown title="Pages" alignRight>
									<NavDropdown.Item eventKey={3.1} as={NavLink} activeclassname="active" to="/track-order">Track Order</NavDropdown.Item>
									<NavDropdown.Item eventKey={3.2} as={NavLink} activeclassname="active" to="/invoice">Invoice</NavDropdown.Item>
									<NavDropdown.Item eventKey={3.3} as={NavLink} activeclassname="active" to="/login">Login</NavDropdown.Item>
									<NavDropdown.Item eventKey={3.4} as={NavLink} activeclassname="active" to="/register">Register</NavDropdown.Item>
									<NavDropdown.Item eventKey={3.5} as={NavLink} activeclassname="active" to="/404">404</NavDropdown.Item>
									<NavDropdown.Item eventKey={3.6} as={NavLink} activeclassname="active" to="/extra">Extra</NavDropdown.Item>
								</NavDropdown> */}
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>
			</div>
		);
	}
}


const RestaurantLink = () => {
	return (
		<>
			<Nav.Link as={NavLink} to="/restaurants" activeClassName="active" className="border-0">Restaurants</Nav.Link>
		</>
	)
}


const UserDropDown = () => {
	const user = useContext(UserContext);
	const history = useHistory();

	const handleSignOut = () => {
		// clear the session
		sessionStorage.clear();
		// redirect them to the home page
		history.replace("/");
		signOut();
		toast.success("You are signed out");
	}

	if (!user) {
		return (
			<>
				<Nav.Link as={Link} to="/login">
					Log in
				</Nav.Link>
			</>
		)
	}

	return (
		<>
			{user && user.role === "customer" &&
				<NavDropdown alignRight
					title={
						<DropDownTitle
							className='d-inline-block'
							image="img/user/default-profile.webp"
							imageAlt='user'
							imageClass="nav-osahan-pic rounded-pill"
							title={user.name}
						/>
					}
				>
					<NavDropdown.Item eventKey={1.1} as={NavLink} activeclassname="active" to="/myaccount/orders"><Icofont icon='food-cart' /> Orders</NavDropdown.Item>
					<NavDropdown.Item eventKey={1.2} as={NavLink} activeclassname="active" to="/myaccount/addresses"><Icofont icon='location-pin' /> Addresses</NavDropdown.Item>
					<NavDropdown.Item eventKey={1.3} ><button onClick={handleSignOut} style={{ background: 'transparent', border: 'none', color: 'black' }}><Icofont className="pr-1" icon='sign-out' />Sign out</button></NavDropdown.Item>
				</NavDropdown>
			}
			{user && user.role === "business" &&
				<NavDropdown alignRight
					title={
						<DropDownTitle
							className='d-inline-block'
							image={user.photoURL || "img/user/default-profile.webp"}
							imageAlt='user'
							imageClass="nav-osahan-pic rounded-pill"
							title={user.name || 'My Restaurant'}
						/>
					}
				>
					<NavDropdown.Item eventKey={2.1} as={NavLink} activeclassname="active" to="/myrestaurant/meals"><Icofont icon='fast-food' /> Meals</NavDropdown.Item>
					<NavDropdown.Item eventKey={2.2} as={NavLink} activeclassname="active" to="/myrestaurant/orders"><Icofont icon='food-cart' /> Orders</NavDropdown.Item>
					<NavDropdown.Item eventKey={2.3} ><button onClick={handleSignOut} style={{ background: 'transparent', border: 'none', color: 'black' }}><Icofont className="pr-1" icon='sign-out' />Sign out</button></NavDropdown.Item>
					{/* <NavDropdown.Item eventKey={4.5} as={NavLink} activeclassname="active" to="/myrestaurant/details"><Icofont icon='user-alt-7' /> Account</NavDropdown.Item> */}
				</NavDropdown>
			}
		</>
	)
}

export default Header;
