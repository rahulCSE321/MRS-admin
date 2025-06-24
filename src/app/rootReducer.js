import { combineReducers } from "@reduxjs/toolkit";
import { adminApi } from "../features/api/adminApi";
import { authApi } from "../features/api/authApi";


const rootReducer=combineReducers({
    [adminApi.reducerPath]:adminApi.reducer,
    [authApi.reducerPath]:authApi.reducer
})

export default rootReducer