import { combineReducers } from 'redux';
// Reducers
import app from './app';
import inventory from './inventory';
import user from './user';

export default combineReducers({
    app,
    inventory,
    user,
});