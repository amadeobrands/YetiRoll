import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from "./reducers";
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const middleWares = applyMiddleware(sagaMiddleware);

const store = createStore(
    rootReducer,
    compose(middleWares)
);

sagaMiddleware.run(rootSaga);

export default store;