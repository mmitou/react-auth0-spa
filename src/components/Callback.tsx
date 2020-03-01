import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { action } from 'sagas';
import { State, User } from 'ducks';
import { Spinner } from 'react-bootstrap';

export const Callback = () => {
	const user = useSelector<State, User | null>(state => state.auth0.user, shallowEqual);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		if (user == null) {
			dispatch(action.auth0.handleRedirectCallback.started());
		} else {
			history.replace('/');
		}
	});

	return (
		<Spinner animation="border" role="status">
			<span className="sr-only">Loading...</span>
		</Spinner>
	);
}
