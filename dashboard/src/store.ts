"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./redux/reducers/dashboard-slice";
import userSlice from "./redux/reducers/user-slice";
import fetchStatusSlice from "./redux/reducers/fetch-status-slice";
import apiKeysSlice from "./redux/reducers/api-keys-slice";
import adminDashboardSlice from "./redux/reducers/admin-dashboard-slice";
import userActivitySlice from "./redux/reducers/user-activity-slice";

export const store = configureStore({
  reducer: combineReducers({
    dashboard: dashboardSlice,
    user: userSlice,
    fetchStatus: fetchStatusSlice,
    apiKeys: apiKeysSlice,
    adminDashboard: adminDashboardSlice,
    userActivity: userActivitySlice,
  }),
});

export type AppDispatch = typeof store.dispatch;
