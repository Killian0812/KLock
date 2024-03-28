import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { FirebaseProvider } from './context/FirebaseProvider';
import { AuthProvider } from './context/AuthProvider';
import { SocketProvider } from './context/SocketProvider';
import { NotificationProvider } from './context/NotificationProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <FirebaseProvider>
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </NotificationProvider>
    </AuthProvider>
  </FirebaseProvider>
  // </React.StrictMode>
);

// reportWebVitals();
