import { takeLatest, fork, call, put, select } from 'redux-saga/effects';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import { SagaIterator } from 'redux-saga';
import { action, Auth0Client } from 'ducks';
import createAuth0Client from '@auth0/auth0-spa-js';

const actionCreator = actionCreatorFactory();

export type Auth0ClientOptions = {
	domain:string,
	client_id:string,
	redirect_uri: string
};

// action
export const createAuth0ClientAction =
	actionCreator.async<Auth0ClientOptions, Auth0Client, Error>('auth0/CREATE_AUTH0CLIENT');
export const handleRedirectCallbackAction =
	actionCreator.async<void, void, Error>('auth0/HANDLE_REDIRECT_CALLBACK');

function* createAuth0ClientWorker(opt: Auth0ClientOptions) {
	const client = yield call(createAuth0Client, opt);
	yield put(action.auth0.setAuth0Client(client));
}

function* handleRedirectCallbackWorker() {
	const client = yield select(state => state.auth0.client);
	if (client == null) {
		throw new Error("state.auth0.client is null");
	}
	const _redirectLoginResult = yield call([client, 'handleRedirectCallback']);

	// DEBUG
	console.log(_redirectLoginResult);

	const user = yield call([client, 'getUser']);
	yield put(action.auth0.setAuth0User(user));
}

const boundCreateAuth0ClientWorker =
	bindAsyncAction(createAuth0ClientAction, {skipStartedAction: true})(createAuth0ClientWorker);
const boundHandleRedirectCallbackWorker =
	bindAsyncAction(handleRedirectCallbackAction, {skipStartedAction: true})(handleRedirectCallbackWorker);

function* createAuth0Handler(): SagaIterator {
	yield takeLatest(createAuth0ClientAction.started, function* ({payload}) {
		yield call(boundCreateAuth0ClientWorker, payload); 
	});
}
 
function* redirectCallbackHandler(): SagaIterator {
	yield takeLatest(handleRedirectCallbackAction.started, function* ({payload}) {
		yield call(boundHandleRedirectCallbackWorker, payload);
	});
}

function* auth0Saga(): SagaIterator {
	yield fork(createAuth0Handler);
	yield fork(redirectCallbackHandler);
}
