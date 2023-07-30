import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router } from 'react-router-dom';
import { StateProvider } from './context/StateProvider';
import reducer from './context/Reducer';
import { initialState } from './context/initialState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router><StateProvider initialState={initialState} reducer = {reducer}><App/></StateProvider></Router>
  </React.StrictMode>
);


reportWebVitals();
