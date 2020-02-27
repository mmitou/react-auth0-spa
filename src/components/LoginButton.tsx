import React  from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { action } from 'sagas';
import { State, User } from 'ducks';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const LoginButton = () => {
	const user = useSelector<State, User | null>(state => state.auth0.user, shallowEqual);
	const history = useHistory();
	const dispatch = useDispatch();

	const login = () => {
		dispatch(action.auth0.loginWithRedirect.started());
	};

	const logout = () => {
		console.log("logout pushed!");
		dispatch(action.auth0.logout.started());
	};

	if (user == null) {
		return (<Button className="px-5" onClick={login}>Log in</Button>);
	} else {
		return (
			<Dropdown alignRight>
				<Dropdown.Toggle id="profileDropDown" variant="light">
					<img src={user.picture} alt="Profile" className="nav-user-profile rounded-circle" width="50" />
				</Dropdown.Toggle>

				<Dropdown.Menu>
					<Dropdown.Header> {user.name} </Dropdown.Header>
					<Dropdown.Item onClick={()=>history.push("/about")}>
						<FontAwesomeIcon icon="user" className="mr-2" /> About
					</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item onClick={logout}>
						<FontAwesomeIcon icon="power-off" className="mr-2" /> Log out
					</Dropdown.Item>

				</Dropdown.Menu>
			</Dropdown>
		);
	}
}
