import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { EchoServiceClient } from 'echo/EchoServiceClientPb';
import { EchoRequest } from 'echo/echo_pb';

export const Echo = () => {
	const echoService = useMemo(() => new EchoServiceClient('http://localhost:8080'), []);
	const [message, setMessage] = useState("");
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);
	}
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		const req = new EchoRequest();
		req.setMessage(message);
		echoService.echo(req, {}, function(err, res) {
			alert("echo done. look console");
			if (err == null) {
				console.log(res);
			} else {
				console.log(err);
			}
		});

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
