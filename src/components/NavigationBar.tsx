import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const NavigationBar = () => {
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
