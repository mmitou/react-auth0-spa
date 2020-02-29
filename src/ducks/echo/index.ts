import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { EchoServiceClient } from 'echo/EchoServiceClientPb';

// state
export type State = {
	client: EchoServiceClient | null;
};

// action
const actionCreator = actionCreatorFactory();
export const action = {
	setClient: actionCreator<EchoServiceClient>('auth0/SET_AUTH0CLIENT'),
};

// reducer
const initialState: State = {client: null};
export const reducer = reducerWithInitialState(initialState)
	.case(action.setClient, (_:State, client: EchoServiceClient): State => {return {client};});
