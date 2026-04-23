import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import './Toast.css';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast__container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <span className="toast__icon">
              {toast.type === 'success' ? '✦' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="toast__message">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);