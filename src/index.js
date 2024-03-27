import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthProvider';
import { SocketProvider } from './context/SocketProvider';
import { NotificationProvider } from './context/NotificationProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <AuthProvider>
    <NotificationProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </NotificationProvider>
  </AuthProvider>
  // </React.StrictMode>
);

// reportWebVitals();
