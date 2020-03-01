import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

// state
export type State = {
	errors: Error[]
};

// action
const actionCreator = actionCreatorFactory();
export const action = {
	push: actionCreator<Error>('errors/push'),
	pop: actionCreator('errors/pop'),
};

// reducer
const initialState: State = {errors:[]};
export const reducer = reducerWithInitialState(initialState)
	.case(action.push, (s: State, e: Error) => {
		const errors = s.errors.concat(e);
		return {errors};
	})
	.case(action.pop, (state:State) => {
		const errors = state.errors.slice(0, -1);
		return {errors};
	});
