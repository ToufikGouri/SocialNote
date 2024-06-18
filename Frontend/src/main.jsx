import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal'
import { Provider } from "react-redux"
import { store } from "./redux/store.js"

// it's not important but this call ensures that screen readers don't see the main content when the modal is open, improving accessibility.
Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
