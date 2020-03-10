import { take, fork, call, put, select } from 'redux-saga/effects';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import actionCreatorFactory from 'typescript-fsa';
import * as ducks from 'ducks';
import { EchoServiceClient } from 'echo/EchoServiceClientPb';
import { EchoRequest, EchoResponse } from 'echo/echo_pb';

// action
const actionCreator = actionCreatorFactory('echo');
export const action = {
	echo: actionCreator.async<string, null, Error>('ECHO')
};

// saga
function* createEchoServiceClientWorker() {
	const client = yield select(state => state.echo.client);
	if (client == null) {
		if (process.env.REACT_APP_ECHOSERVICE_URL == null) {
			throw new Error("process.env.REACT_APP_ECHOSERVICE_URL is not defined");
		}
		const newClient = new EchoServiceClient(process.env.REACT_APP_ECHOSERVICE_URL, null, {
			withCredentials: "true"
		});
		yield put(ducks.action.echo.setClient(newClient));
	}
}

function* echoWorker(message: string) {
	const auth0Client = yield select(state => state.auth0.client);
	if (auth0Client == null) {
		throw new Error("state.auth0.client is null");
	}

	const claims = yield call({context: auth0Client, fn: auth0Client.getIdTokenClaims});
	const idToken = claims.__raw;
	const meta = {authorization: `Bearer ${idToken}`};
	const req = new EchoRequest();
	req.setMessage(message);

	const echoClient = yield select(state => state.echo.client);
	if (echoClient == null) {
		throw new Error("state.echo.client is null");
	}

	async function invokeEcho() {
		const p = new Promise((resolve, reject) => {
			echoClient.echo(req, meta, (err:Error, echoRes:EchoResponse) => {
				if (err) {
					reject(err);
				} else {
					resolve(echoRes);
				}
			});
		});
		return p;
	}

	const res = yield call(invokeEcho);
	yield put(ducks.action.echo.setEchoResponse(res));
}

const boundEchoWorker =
	bindAsyncAction(action.echo, {skipStartedAction: true})(echoWorker);

function* echoStartedWatcher() {
	while(true) {
		const {payload} = yield take(action.echo.started);
		try {
			yield call(createEchoServiceClientWorker);
			yield call(boundEchoWorker, payload);
		} catch(e) {
			yield put(ducks.action.errors.push(e));
		}
	}
}

export function* rootSaga() {
	yield fork(echoStartedWatcher);
}
