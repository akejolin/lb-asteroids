import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import asteroids from 'src/asteroids/reducer'
export const store = configureStore({
  reducer: {
    asteroids,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch