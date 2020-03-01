import { take, fork, call, put, select } from 'redux-saga/effects';
import actionCreatorFactory from 'typescript-fsa';
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
		if (process.env.REACT_APP_ECHOSERVICE_URL == null) {
			throw new Error("process.env.REACT_APP_ECHOSERVICE_URL is not defined");
		}
		const client = new EchoServiceClient(process.env.REACT_APP_ECHOSERVICE_URL);
		yield put(ducks.action.echo.setClient(client));
	}
}

function* echoWorker(message: string) {
	const auth0Client = yield select(state => state.auth0.client);
	if (auth0Client == null) {
		throw new Error("state.auth0.client is null");
	}

	async function getToken(): Promise<string> {
		return await auth0Client.getTokenSilently();
	};

	const token = yield call(getToken);
	const meta = {Authorization: `Bearer ${token}`};
	const req = new EchoRequest();
	req.setMessage(message);

	const echoClient = yield select(state => state.echo.client);
	if (echoClient == null) {
		throw new Error("state.echo.client is null");
	}

	async function invokeEcho() {
		const p = new Promise((resolve, reject) => {
			echoClient.echo(req, meta, function(err:Error, res:EchoResponse) {
				if (err) {
					reject(err);
				} else {
					resolve(res);
				}
			});
		});
		return p;
	}

	const res = yield call(invokeEcho);
	yield put(ducks.action.echo.setEchoResponse(res));
}

function* echoStartedWatcher() {
	while(true) {
		const {payload} = yield take(action.echo.started);
		try {
			yield call(createEchoServiceClientWorker);
			yield call(echoWorker, payload);
			yield put(action.echo.done(payload));
		} catch(e) {
			yield put(action.echo.failed(e));
			yield put(ducks.action.errors.push(e));
		}
	}
}

export function* rootSaga() {
	yield fork(echoStartedWatcher);
}
