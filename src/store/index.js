import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import threadsReducer from './threadsSlice';
import threadDetailReducer from './threadDetailSlice';
import usersReducer from './usersSlice';
import leaderboardReducer from './leaderboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    users: usersReducer,
    leaderboard: leaderboardReducer,
  },
});

export default store;
