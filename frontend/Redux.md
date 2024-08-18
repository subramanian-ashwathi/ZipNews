# HOW TO USE REDUX FOR STATE MANAGEMENT
1. Import `useSelector` and `useDispatch` hook.
`useDispatch` is not required if you don't change the currentState on a given component. `useSelector` isn't required in a component if the component doesn't need to know the value of `currentState`.
    
        import { useSelector, useDispatch } from 'react-redux'

2. Import the store and action creators to each component that requires the access of `currentState` and `changeState` reducer (make sure the path to them are correct). `changeState` is used to change the value of `currentState`. It requires a value as parameter, in this case the value would be the name of the state that the user has clicked.

        import store from "../../../store/store";
        // the code below is used to import the reducor (function) to change the currentState
        import { changeState } from "../../../store/stateSlice";

3. Get the currentState from the store using useSelector

        const state = useSelector((state) => state.currentState.value);

4. Use dispatch to change the state (currentState) in the store

        const dispatch = useDispatch()

5. Example of changing state

        const handleChangeState = (e) =>  {
            // the value would be the state the user has picked
            const value = e.target.value
            if (value) {
                dispatch(changeState(value));
            }
        }