import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './Context/AuthContext';
import RoomContext from './Context/RoomContext';
import 'antd/dist/antd.css';



ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <RoomContext >
        <App />
      </RoomContext>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
