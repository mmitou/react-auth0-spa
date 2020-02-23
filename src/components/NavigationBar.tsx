import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { action } from 'sagas';

export const NavigationBar = () => {
	const dispatch = useDispatch();	
	const stableDispatch = useCallback(dispatch, []);

	useEffect(()=> {
		stableDispatch(action.auth0.createAuth0Client.started());
	}, [stableDispatch]);

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
						<Nav.Item>
							<Button className="px-5">Log in</Button>
						</Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
