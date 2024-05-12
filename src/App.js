import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register.component';
import Login from './components/Login.component';
import Forget from './components/Forget.component';
import ResetPassword from './components/ResetPassword.component';
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forget" element={<Forget />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<PersistLogin />}>

            {/* login required routes */}
            <Route element={<Authenticate />}>

              {/* user role - authenticate only */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="profile/:tab?" element={<Profile />} /> { /*Optional param*/}
                <Route path="rooms" element={<Rooms />} />
                <Route path="rooms/:roomId" element={<RoomDetail />} />
              </Route>

              {/* admin role - need authorization */}

              <Route element={<Authorize allowedRoles={["ADMIN"]} />}> { /*Protected route*/}

                <Route path='/admin' element={<AdminLayout />}>
                  <Route path='dashboard' element={<Dashboard />} />

                  <Route path='building' element={<Building />} />
                  <Route path="add-room" element={<AddRoom />} />
                  <Route path="edit-room/:roomId" element={<EditRoom />} />

                  <Route path='accounts' element={<Accounts />} />

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
