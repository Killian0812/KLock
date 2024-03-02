import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './components/Register.component';
import Login from './components/Login.component';
import Layout from './components/Layout.component';
import Home from './pages/Home.page';
import Profile from './pages/Profile.page';
import Chat from './pages/Chat.page';
import GroupChat from './pages/GroupChat.page';
import Settings from './pages/Settings.page';

function App() {
  return (
    <main className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chat" element={<Chat />} />
            <Route path="groupchat" element={<GroupChat />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
