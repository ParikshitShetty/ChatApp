import { combineReducers, configureStore } from "@reduxjs/toolkit";
import MessageReducer from "../reducers/MessageReducer";


const rootReducer = combineReducers({
    MessageReducer,
});

const store = configureStore({reducer:rootReducer});

export default store;