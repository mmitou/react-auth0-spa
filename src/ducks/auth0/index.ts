import actionCreatorFactory from 'typescript-fsa';
import createAuth0Client from '@auth0/auth0-spa-js';
import { takeLatest, fork, call, put } from 'redux-saga/effects';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import { SagaIterator } from 'redux-saga';

export type Auth0Client = ReturnType<typeof createAuth0Client> | null;
export type Auth0ClientOptions = {
	domain:string,
	client_id:string,
	redirect_uri: string
};

let auth0: Auth0Client | null = null;
const actionCreator = actionCreatorFactory();

async function InvokeHandleRedirectCallback() {
	if (auth0 == null) {
		throw new Error('auth0 is null');
	} 
	let client = await auth0;
	await (client.handleRedirectCallback());
	return;
}

async function InvokeCreateAuth0Client(opt: Auth0ClientOptions) {
	const client = await createAuth0Client(opt);
	return;
}

// sagas
export const createAuth0ClientAction =
	actionCreator.async<Auth0ClientOptions, Auth0Client, Error>('auth0/CREATE_AUTH0CLIENT');
export const handleRedirectCallbackAction =
	actionCreator.async<void, void, Error>('auth0/HANDLE_REDIRECT_CALLBACK');

function* createAuth0ClientWorker(opt: Auth0ClientOptions) {
	yield call(InvokeCreateAuth0Client, opt);
}

function* handleRedirectCallbackWorker() {
	yield call(InvokeHandleRedirectCallback);
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
