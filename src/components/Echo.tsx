import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';


export const Echo = () => {
	return (
		<Container className="py-5">
			<Row>
				<Form>
					<Form.Group as={Row} controlId="formEcho">
						<Form.Label column sm="2">Echo:</Form.Label>
						<Col sm="8">
							<Form.Control type="text" placeholder="input message" />
						</Col>
						<Col sm="2">
							<Button type="submit">Send</Button>
						</Col>
					</Form.Group>
				</Form>
			</Row>
			<Row>
			<hr />
			</Row>
		</Container>
	);
}
