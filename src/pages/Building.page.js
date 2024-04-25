import { useEffect, useState } from "react";
import $ from 'jquery';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const Building = () => {

  const [rooms, setRooms] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => { // fetch data
    async function fetchRooms() {
      const res = await axiosPrivate.get(`/admin/allRoom`);
      setRooms(res.data);
    }
    fetchRooms();
  }, [axiosPrivate]);

  const removeRoom = (roomId) => {
    axiosPrivate.delete(`/admin/room/${roomId}`).then(() => {
      setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
      $('#rooms').DataTable().destroy(false); // need destroy DataTable before re-render because of state changes
    }).catch((err) => {
      console.log(err);
    })
  }

  const roomsList = rooms.map((room) => {
    return (
      <tr key={room._id} id={room._id}>
        <td>{room.name}</td>
        <td>{room.mac}</td>
        <td><button className="Button blue" onClick={
          () => {
            navigate(`/admin/edit-room/${room._id}`);
          }
        }>Edit</button> | <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button className="Button red">Delete</button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="AlertDialogOverlay" />
              <AlertDialog.Content className="AlertDialogContent">
                <AlertDialog.Title className="AlertDialogTitle">Are you absolutely sure?</AlertDialog.Title>
                <br></br>
                <AlertDialog.Description className="AlertDialogDescription">
                  This action cannot be undone.
                  <br></br>
                  All associated data, including entry history, will be permanently deleted from the database.
                </AlertDialog.Description>
                <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
                  <AlertDialog.Cancel asChild>
                    <button className="Button mauve">Cancel</button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button className="Button red" onClick={() => removeRoom(room._id)}>Yes, confirm action</button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </td>
      </tr>
    );
  });

  console.log('Current', roomsList.length);

  useEffect(() => {
    if (rooms?.length <= 0)
      return;
    $('#rooms').DataTable({ // if state changes, init DataTables with new data
      columnDefs: [
        { className: "dt-head-center", targets: [0, 1, 2] },
        { orderable: false, targets: 2 }
      ],
    });
    return () => {
      $('#rooms').DataTable().destroy(false); // still need cleanup function to avoid mem-leak
    }
  }, [rooms]);

  return (
    <div className='RoomEntries' style={{ marginTop: '70px' }}>
      <section className="entriesSection">
        <h1>Your Building</h1><hr></hr><br></br>
        <table id='rooms' style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Room</th>
              <th>Device MAC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              roomsList
            }
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Building