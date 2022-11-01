import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Routers from './Router'

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const mockLogin = () => {
    setIsLogin(true);
  }
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {
        isLogin ? <Routers /> : <div>未登录</div>
      }
    </div>
  );
}

export default App;
