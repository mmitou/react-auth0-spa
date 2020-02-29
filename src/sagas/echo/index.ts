import { take, fork, call, put, select } from 'redux-saga/effects';
import actionCreatorFactory from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import * as ducks from 'ducks';
import { EchoServiceClient } from 'echo/EchoServiceClientPb';
import { EchoRequest, EchoResponse } from 'echo/echo_pb';

// action
const actionCreator = actionCreatorFactory();
export const action = {
	echo: actionCreator.async<string, null, Error>('echo/ECHO')
};

// saga
function* createEchoServiceClientWorker() {
	const client = yield select(state => state.echo.client);
	if (client == null) {
		if (process.env.REACT_ECHOSERVICE_URL == null) {
			throw new Error("process.env.REACT_ECHOSERVICE_URL is not defined");
		}
		const client = new EchoServiceClient(process.env.REACT_ECHOSERVICE_URL);
		yield put(ducks.action.echo.setClient(client));
	}
}

function* echoWorker(message: string) {
	const auth0Client = yield select(state => state.auth0.client);
	if (auth0Client == null) {
		throw new Error("state.auth0.client is null");
	}
	const echoClient = yield select(state => state.echo.client);
	if (echoClient == null) {
		throw new Error("state.echo.client is null");
	}

	const token = yield call({context: auth0Client, fn: auth0Client.getTokenSilently});
	const meta = {Authorization: `Bearer ${token}`};
	const req = new EchoRequest();
	req.setMessage(message);
	console.log("before echo:", meta);
	echoClient.echo(req, meta, function(err:Error, res:EchoResponse) {
		if (err) {
			console.log("echo failed:", err);
		} else {
			console.log("echo succeeded:", res.getMessage());
		}
	});
}

const boundEchoWorker
	= bindAsyncAction(action.echo, {skipStartedAction: true})(echoWorker);

function* echoStartedWatcher() {
	while(true) {
		const {payload} = yield take(action.echo.started);
		yield call(createEchoServiceClientWorker);
		yield call(boundEchoWorker, payload);
	}
}

export function* rootSaga() {
	yield fork(echoStartedWatcher);
}
