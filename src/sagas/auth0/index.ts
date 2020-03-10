import { take, fork, call, put, select } from 'redux-saga/effects';
import actionCreatorFactory from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import * as ducks from 'ducks';
import createAuth0Client from '@auth0/auth0-spa-js';

// action
const actionCreator = actionCreatorFactory('auth0');
export const action = {
	handleRedirectCallback: actionCreator.async<void, void, Error>('HANDLE_REDIRECT_CALLBACK'),
	loginWithRedirect: actionCreator.async<void, void, Error>('LOGIN_WITH_REDIRECT'),
	logout: actionCreator.async<void, void, Error>('LOGOUT'),
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
		const newClient = yield call(createAuth0Client, opt);
		yield put(ducks.action.auth0.setClient(newClient));
	}
}

function* handleRedirectCallbackWorker() {
	const client = yield select(state => state.auth0.client);
	if (client == null) {
		throw new Error("state.auth0.client is null");
	}
	yield call({context: client, fn: client.handleRedirectCallback});
	const user = yield call({context: client, fn: client.getUser});
	yield put(ducks.action.auth0.setUser(user));
}

function* loginWithRedirectWorker() {
	const client = yield select(state => state.auth0.client);
	if (client == null) {
		throw new Error("state.auth0.client is null");
	}
	yield call({context: client, fn: client.loginWithRedirect});
}

function* logoutWorker() {
	const client = yield select(state => state.auth0.client);
	if (client == null) {
		throw new Error("state.auth0.client is null");
	}
	yield call({context: client, fn: client.logout});
	yield put(ducks.action.auth0.setUser(null));
}

const boundHandleRedirectCallbackWorker =
	bindAsyncAction(action.handleRedirectCallback, {skipStartedAction: true})(handleRedirectCallbackWorker);

const boundLoginWithRedirectWorker =
	bindAsyncAction(action.loginWithRedirect, {skipStartedAction: true})(loginWithRedirectWorker);

const boundLogoutWorker =
	bindAsyncAction(action.logout, {skipStartedAction: true})(logoutWorker);

function* redirectCallbackWatcher() {
	while(true) {
		yield take(action.handleRedirectCallback.started);
		yield call(createAuth0ClientWorker);
		yield call(boundHandleRedirectCallbackWorker);
	}
}

function* loginWithRedirectWatcher() {
	while(true) {
		yield take(action.loginWithRedirect.started);
		yield call(createAuth0ClientWorker);
		yield call(boundLoginWithRedirectWorker);
	}
}

function* logoutWatcher() {
	while(true) {
		yield take(action.logout.started);
		yield call(createAuth0ClientWorker);
		yield call(boundLogoutWorker);
	}
}

export function* rootSaga() {
	yield fork(redirectCallbackWatcher);
	yield fork(loginWithRedirectWatcher);
	yield fork(logoutWatcher);
}
