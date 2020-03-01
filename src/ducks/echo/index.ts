import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { EchoServiceClient } from 'echo/EchoServiceClientPb';
import { EchoResponse } from 'echo/echo_pb';

// state
export type State = {
	client: EchoServiceClient | null;
	res: EchoResponse | null;
};

// action
const actionCreator = actionCreatorFactory();
export const action = {
	setClient: actionCreator<EchoServiceClient>('echo/SET_ECHOSERVICECLIENT'),
	setEchoResponse: actionCreator<EchoResponse | null>('echo/SET_ECHORESPONSE'),
};

// reducer
const initialState: State = {client: null, res: null};
export const reducer = reducerWithInitialState(initialState)
	.case(action.setClient, (state: State, client: EchoServiceClient): State => {
		return {...state, client};
	})
	.case(action.setEchoResponse, (state:State, res: EchoResponse |null): State => {
		return {...state, res};
	});
