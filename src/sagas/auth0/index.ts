import { take, fork, call, put, select } from 'redux-saga/effects';
import actionCreatorFactory from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import * as ducks from 'ducks';
import createAuth0Client from '@auth0/auth0-spa-js';

// action
const actionCreator = actionCreatorFactory();
export const action = {
	handleRedirectCallback: actionCreator.async<void, void, Error>('auth0/HANDLE_REDIRECT_CALLBACK'),
	loginWithRedirect: actionCreator.async<void, void, Error>('auth0/LOGIN_WITH_REDIRECT'),
};

// saga
function* createAuth0ClientWorker() {
	const client = yield select(state => state.auth0.client);
	if (client == null) {
		if (process.env.REACT_APP_DOMAIN == null) {
			throw new Error("env not defined");
		}
		if (process.env.REACT_APP_CLIENT_ID == null) {
			throw new Error("env not defined");
		}
		if (process.env.REACT_APP_REDIRECT_URI == null) {
			throw new Error("env not defined");
		}
		const opt = {
			domain: process.env.REACT_APP_DOMAIN,
			client_id: process.env.REACT_APP_CLIENT_ID,
			redirect_uri: process.env.REACT_APP_REDIRECT_URI,
		}
		const client = yield call(createAuth0Client, opt);
		yield put(ducks.action.auth0.setAuth0Client(client));
	}
}

function* handleRedirectCallbackWorker() {
	const client = yield select(state => state.auth0.client);
	if (client == null) {
		throw new Error("state.auth0.client is null");
	}
	console.log("before client.handleRedirectCallback");
	yield call({context: client, fn: client.handleRedirectCallback});
	console.log("after client.handleRedirectCallback");

	console.log("before client.getUser");
	const user = yield call({context: client, fn: client.getUser});
	console.log("after client.getUser");
	console.log("user", user);
	yield put(ducks.action.auth0.setAuth0User(user));
}

function *loginWithRedirectWorker() {
	const client = yield select(state => state.auth0.client);
	if (client == null) {
		throw new Error("state.auth0.client is null");
	}
	yield call({context: client, fn: client.loginWithRedirect});
}

const boundLoginWithRedirectWorker =
	bindAsyncAction(action.loginWithRedirect, {skipStartedAction: true})(loginWithRedirectWorker);

const boundHandleRedirectCallbackWorker =
	bindAsyncAction(action.handleRedirectCallback, {skipStartedAction: true})(handleRedirectCallbackWorker);

function* redirectCallbackHandler() {
	while(true) {
		yield take(action.handleRedirectCallback.started);
		yield call(createAuth0ClientWorker);
		yield call(boundHandleRedirectCallbackWorker);
	}
}

function *loginWithRedirectHandler() {
	while(true) {
		yield take(action.loginWithRedirect.started);
		yield call(createAuth0ClientWorker);
		yield call(boundLoginWithRedirectWorker);
	}
}

export function* rootSaga() {
	// yield call(createAuth0ClientWorker);
	yield fork(redirectCallbackHandler);
	yield fork(loginWithRedirectHandler);
}
