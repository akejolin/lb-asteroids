import * as React from "react"
import { Provider } from "react-redux"
import App from "src/App"
import { store } from 'src/store'

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)