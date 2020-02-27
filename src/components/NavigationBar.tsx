import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { LoginButton } from './LoginButton';

export const NavigationBar = () => {
	return (
		<Navbar bg="light" className="py-3">
			<Container>
				<LinkContainer to="/">
					<Navbar.Brand>Auth0 Sample</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle aria-controls="app-navbar" />
				<Navbar.Collapse id="app-navbar">
					<Nav className="mr-auto">
						<Nav.Item>
							<LinkContainer to="/">
								<Nav.Link>Home</Nav.Link>
							</LinkContainer>
						</Nav.Item>
						<Nav.Item>
							<LinkContainer to="/echo">
								<Nav.Link>Echo</Nav.Link>
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
							<LoginButton />
						</Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
