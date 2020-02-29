import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { action } from 'sagas';

export const Echo = () => {
	const dispatch = useDispatch();
	const [message, setMessage] = useState("");
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);
	}
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		dispatch(action.echo.echo.started(message));
		e.preventDefault();
	}

	return (
		<Container className="py-5">
			<Row>
				<Form onSubmit={handleSubmit}>
					<Form.Group as={Row} controlId="formEcho">
						<Form.Label column sm="2">Echo:</Form.Label>
						<Col sm="8">
							<Form.Control type="text" value={message} onChange={handleChange} placeholder="input message" />
						</Col>
						<Col sm="2">
							<Button type="submit">Send</Button>
						</Col>
					</Form.Group>
				</Form>
			</Row>
		</Container>
	);
}
