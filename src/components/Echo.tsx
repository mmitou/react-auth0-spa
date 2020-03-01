import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { action } from 'sagas';
import { State } from 'ducks';
import { EchoResponse } from 'echo/echo_pb';

export const Echo = () => {
	const res = useSelector<State, EchoResponse | null>(state => state.echo.res, shallowEqual);
	const dispatch = useDispatch();
	const [message, setMessage] = useState("");
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);
	}
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		dispatch(action.echo.echo.started(message));
		e.preventDefault();
	}
	const responseMessage = res == null? "" : res.getMessage();

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
			<Row>
				{responseMessage}
			</Row>
		</Container>
	);
}
