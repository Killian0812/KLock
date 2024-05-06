import { useEffect, useState } from "react";
import $ from 'jquery';
import ReactSwitch from "react-switch";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import React from "react";

const times = (
  <svg
    viewBox="-3 0 15 15"
    height="100%"
    width="100%"
    style={{ position: "absolute", top: 0 }}
  >
    <path
      d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12"
      fill="#fff"
      fillRule="evenodd"
    />
  </svg>
);

const tick = (
  <svg
    height="100%"
    width="100%"
    viewBox="-2 0 17 15"
    style={{ position: "absolute", top: 0 }}
  >
    <path
      d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0"
      fill="#fff"
      fillRule="evenodd"
    />
  </svg>
);

const Accounts = () => {

  const [users, setUsers] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => { // fetch data
    async function fetchUsers() {
      const res = await axiosPrivate.get(`/admin/allUsers`);
      const usersList = res.data.filter(user => !user.roles.includes("ADMIN"));
      setUsers(usersList);
    }
    fetchUsers();
  }, [axiosPrivate]);

  function handleChangeUserStatus(id) {
    axiosPrivate.put(`/admin/blockOrUnblock/${id}`)
      .then(() => {
        const userIndex = users.findIndex(user => user._id === id);
        if (userIndex !== -1) {
          const updatedUsers = [...users];
          updatedUsers[userIndex].active = !updatedUsers[userIndex].active;
          setUsers(updatedUsers);
        }
      })
      .catch(err => console.log(err));
  }

  const usersList = users.map((user) => {
    return (
      <tr key={user._id} id={user._id}>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.fullname}</td>
        <td>
          <ReactSwitch onColor="#8E0000" offColor="#008E49" checkedIcon={times} uncheckedIcon={tick}
            onChange={() => handleChangeUserStatus(user._id)} checked={!user.active} />
        </td>
      </tr>
    );
  });

  useEffect(() => {
    if (users?.length <= 0)
      return;
    $('#users').DataTable({ // if state changes, init DataTables with new data
      columnDefs: [
        { className: "dt-head-center", targets: [0, 1, 2, 3] },
        { orderable: false, targets: 3 }
      ],
    });
    return () => {
      $('#users').DataTable().destroy(false); // still need cleanup function to avoid mem-leak
    }
  }, [users]);

  return (
    <div className='MainContainer'>
      <section className="contentSection">
        <h1>Manage Accounts</h1><hr></hr><br></br>
        <table id='users' style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Fullname</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              usersList
            }
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Accounts