import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dropdown, Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router-dom';
import { action } from 'sagas';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// debug data
const user = {
	nickname: "masayuki.itou.work",
	name: "masayuki.itou.work@gmail.com",
	picture: "https://s.gravatar.com/avatar/2149ba262dc19f3d47453f774f23411b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png",
	updated_at: "2020-02-23T09:24:50.114Z",
	email: "masayuki.itou.work@gmail.com",
	email_verified: true,
	sub: "auth0|5e312fec5e7dad0e61a1efc1"
}


export const NavigationBar = () => {
	const history = useHistory();
	const dispatch = useDispatch();	
	const [isAuthrorized, setIsAuthorized] = useState(true);

	const login = () => {
		dispatch(action.auth0.createAuth0Client.started());
	};

	return (
		<Navbar bg="light" className="py-3">
			<Container>
				<Navbar.Brand href="/">Auth0 Sample</Navbar.Brand>
				<Navbar.Toggle aria-controls="app-navbar" />
				<Navbar.Collapse id="app-navbar">
					<Nav className="mr-auto">
						<Nav.Item>
							<LinkContainer to="/">
								<Nav.Link>Home</Nav.Link>
							</LinkContainer>
						</Nav.Item>
						<Nav.Item>
							<LinkContainer to="/about">
								<Nav.Link>About</Nav.Link>
							</LinkContainer>
						</Nav.Item>
					</Nav>
					<Nav>
						{ isAuthrorized ?
							(
							  <Nav.Item>
								  <Dropdown>
								 		<Dropdown.Toggle id="profileDropDown" variant="light">
								  		<img src={user.picture} alt="Profile" className="nav-user-profile rounded-circle"
												width="50" />
										</Dropdown.Toggle>

										<Dropdown.Menu>
											<Dropdown.Header>
												{user.name}
											</Dropdown.Header>
											<Dropdown.Item onClick={()=>history.push("/about")}>
								        <FontAwesomeIcon icon="user" className="mr-2" /> About
								    	</Dropdown.Item>

									  	<Dropdown.Divider />
	
									  	<Dropdown.Item onClick={() => alert("log out")}>
										  	<FontAwesomeIcon icon="power-off" className="mr-2" /> Log out
									  	</Dropdown.Item>

										</Dropdown.Menu>
								  </Dropdown>
							  </Nav.Item>
							)
							:
							(
								<Nav.Item>
									<Button className="px-5" onClick={login}>Log in</Button>
								</Nav.Item>
							)
						}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
