import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { State, action } from 'ducks';
import { Modal, Button } from 'react-bootstrap';

export const ErrorModal = () => {
	const errors = useSelector<State, Error[]>(state => state.errors.errors, shallowEqual);
	const [show, setShow] = useState(false);
	const dispatch = useDispatch();
	const message = errors.length === 0 ? "" : errors[errors.length -1].message;

	useEffect(() => {
		setShow(errors.length > 0);
	}, [setShow, errors]);

	return (
		<Modal show={ show } onHide={() => setShow(false)}>
			<Modal.Header>
				<Modal.Title>Error</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>{ message }</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={() => {
					setShow(false);
					dispatch(action.errors.pop());
				}}>OK</Button>
			</Modal.Footer>
		</Modal>
	);
};
