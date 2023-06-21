import { configureStore } from '@reduxjs/toolkit'
import taskReducer from '../redux/reducer';

export default configureStore({
    reducer: {
        taskReducer
    },
})