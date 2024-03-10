import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './components/Register.component';
import Login from './components/Login.component';
import Layout from './components/Layout.component';
import Authenticate from './components/Authenticate.component';
import Authorize from './components/Authorize.component';
import Home from './pages/Home.page';
import Profile from './pages/Profile.page';
import Rooms from './pages/Rooms.page';
import RoomDetail from './pages/RoomDetail.page';
import Settings from './pages/Settings.page';
import Unauthorized from './components/Unauthorized.component';
import Admin from './pages/Admin.page';
import PersistLogin from './components/PersistLogin.component';

function App() {
  return (
    <main className="App">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<PersistLogin />}>

            {/* login required routes */}
            <Route element={<Authenticate />}>

              {/* chat user role - authenticate only */}
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="rooms/:roomId" element={<RoomDetail />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* chat admin role - need authorization */}
              <Route element={<Authorize allowedRoles={["ADMIN"]} />}> { /*Protected route*/}
                <Route path='admin' element={<Admin />}></Route>
              </Route>

            </Route>

          </Route>

        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
