import React from 'react';
import ReactDOM from 'react-dom';
import WithStore from './store/withStore';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <WithStore />
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
