import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './components/Register.component';
import Login from './components/Login.component';
import Home from './components/Home.component';

function App() {
  return (
    <main className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/home" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
