import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ✅ Suppress ResizeObserver warnings globally
const ignoreResizeObserverError = (e) => {
  if (e.message && e.message.includes("ResizeObserver loop")) {
    e.stopImmediatePropagation();
    return;
  }
};
window.addEventListener("error", ignoreResizeObserverError);
window.addEventListener("unhandledrejection", (e) => {
  if (e.reason && e.reason.message && e.reason.message.includes("ResizeObserver loop")) {
    e.preventDefault();
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
