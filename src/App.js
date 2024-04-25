import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register.component';
import Login from './components/Login.component';
import Layout from './components/Layout.component';
import Authenticate from './components/Authenticate.component';
import Authorize from './components/Authorize.component';
import Home from './pages/Home.page';
import Profile from './pages/profile_page/Profile.page';
import Rooms from './pages/Rooms.page';
import RoomDetail from './pages/RoomDetail.page';
import Unauthorized from './components/Unauthorized.component';
import PersistLogin from './components/PersistLogin.component';
import AdminLayout from './components/AdminLayout.component';
import Dashboard from './pages/Dashboard.page';
import Accounts from './pages/Accounts.page';
import AddRoom from './pages/AddRoom.page';
import Building from './pages/Building.page';
import EditRoom from './pages/EditRoom.page';

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
                <Route path="profile/:tab?" element={<Profile />} /> { /*Optional param*/}
                <Route path="rooms" element={<Rooms />} />
                <Route path="rooms/:roomId" element={<RoomDetail />} />
              </Route>

              {/* chat admin role - need authorization */}

              <Route element={<Authorize allowedRoles={["ADMIN"]} />}>

                <Route path='/admin' element={<AdminLayout />}> { /*Protected route*/}
                  <Route path='dashboard' element={<Dashboard />} />
                  <Route path='accounts' element={<Accounts />} />
                  <Route path='building' element={<Building />} />
                  <Route path="add-room" element={<AddRoom />} />
                  <Route path="edit-room/:roomId" element={<EditRoom />} />
                </Route>

              </Route>

            </Route>

          </Route>
          
        </Routes>
      </BrowserRouter>
    </main >
  );
}

export default App;
