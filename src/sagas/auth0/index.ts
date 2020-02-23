import { take, fork, call, put, select } from 'redux-saga/effects';
import actionCreatorFactory from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import * as ducks from 'ducks';
import createAuth0Client from '@auth0/auth0-spa-js';

// action
const actionCreator = actionCreatorFactory();
export const action = {
	createAuth0Client: actionCreator.async<void, ducks.Auth0Client, Error>('auth0/CREATE_AUTH0CLIENT'),
	handleRedirectCallback: actionCreator.async<void, void, Error>('auth0/HANDLE_REDIRECT_CALLBACK'),
};

// saga
function* createAuth0ClientWorker() {
	const opt: Auth0ClientOptions = {
		domain: '',
		client_id: '',
		redirect_uril: '',
	}
	const client = yield call(createAuth0Client, opt);
	yield put(ducks.action.auth0.setAuth0Client(client));
}

function* handleRedirectCallbackWorker() {
	const client = yield select(state => state.auth0.client);
	if (client == null) {
		throw new Error("state.auth0.client is null");
	}
	yield call({context: client, fn: client.handleRedirectCallback});
	const user = yield call({context: client, fn: client.getUser});
	yield put(ducks.action.auth0.setAuth0User(user));
}

const boundCreateAuth0ClientWorker =
	bindAsyncAction(action.createAuth0Client, {skipStartedAction: true})(createAuth0ClientWorker);
const boundHandleRedirectCallbackWorker =
	bindAsyncAction(action.handleRedirectCallback, {skipStartedAction: true})(handleRedirectCallbackWorker);

function* createAuth0Handler() {
	while(true) {
		yield take(action.createAuth0Client.started);
		yield call(boundCreateAuth0ClientWorker); 
	}
}
 
function* redirectCallbackHandler() {
	while(true) {
		yield take(action.handleRedirectCallback.started);
		yield call(boundHandleRedirectCallbackWorker);
	}
}

export function* rootSaga() {
	yield fork(createAuth0Handler);
	yield fork(redirectCallbackHandler);
}
