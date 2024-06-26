import Tippy from '@tippyjs/react/headless';
import { useEffect, useRef, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Toaster, toast } from 'alert';
import debounce from 'lodash.debounce';

import '../../../radix-ui.css';
import CustomAlertDialog from '../../../components/AlertDialog.component';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

function SelectedRoom({ room, handleClick }) {
    return (
        <div style={{ marginLeft: "10px", marginTop: "3px" }}>
            <div className="room-selected-button">
                <span>{room.name}</span>
                <button className='room-remove-selected-button' onClick={() => handleClick()}>
                    <RxCross2 style={{ marginBottom: "10px" }} /></button>
            </div>
        </div>
    )
}
function RoomRegisterTab() {

    const searchRef = useRef();
    const [visible, setVisible] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [rooms, setRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (searchRef.current !== undefined)
            searchRef.current.focus();
    }, [])

    useEffect(() => {
        console.log(`visible: ${visible}`);
    }, [visible])

    useEffect(() => {
        if (!keyword.trim()) {
            setVisible(false);
            setRooms([]);
            return;
        }
        axiosPrivate.get('/home/findRooms/', {
            params: {
                keyword: keyword
            }
        }).then(response => {
            setRooms(response.data);
            setVisible(true);
        }).catch(error => {
            setVisible(false);
            console.error('Error fetching rooms:', error);
        });
    }, [keyword, axiosPrivate]);

    const handleSearching = debounce((e) => {
        setKeyword(e);
    }, 300);

    const handleAddRoom = (room) => { // use .some() and _id because .includes() use reference comparison
        setSelectedRooms(prevRooms => prevRooms.some(currentRoom => currentRoom._id === room._id) ? prevRooms : [...prevRooms, room])
    }

    const handleRemoveRoom = (room) => {
        setSelectedRooms(prevRooms => prevRooms.filter(currentRoom => currentRoom._id !== room._id));
    }

    const handleSubmit = () => {
        axiosPrivate.post(`/home/roomRegister`, selectedRooms)
            .then(() => {
                toast(`Request sent to Admin`);
                setSelectedRooms([]);
                setKeyword('');
            })
            .catch((err) => {
                toast('Unexpected error');
                console.log("Error registering as manager:", err);
            })
    }

    return (
        <div style={{ display: "flex" }}>
            <div style={{ flex: 0.8, borderRight: "1px solid #fff", paddingRight: "10px" }}>
                <Tippy visible={visible} onClickOutside={() => setVisible(false)} interactive placement="bottom-end"
                    render={attrs => (
                        <div className='room-search-wrapper' tabIndex="-1" {...attrs}>
                            <div className='room-search-list'>
                                {
                                    rooms.map((room) => {
                                        return (
                                            <button className='room-search-item' onClick={() => handleAddRoom(room)}
                                                key={room._id}>{room.name}</button>)
                                    })
                                }
                            </div>
                        </div>
                    )}>
                    <div>
                        <FaSearch style={{ margin: '-5px 8px -7px 0' }} size={40} />
                        <input style={{
                            flex: 1, border: "none", borderRadius: "5px",
                            outline: "none", padding: "5px", backgroundColor: "#434343", color: "#fff"
                        }} type='text' ref={searchRef} onChange={(e) => handleSearching(e.target.value)} placeholder='Search for room'></input>
                    </div>
                </Tippy>
            </div>
            <div style={{ flex: 1 }}>
                Selected rooms:<br></br>
                <div style={{ marginTop: '20px', marginLeft: '10px', display: 'flex', flexWrap: 'wrap' }}>
                    {
                        selectedRooms.map((selectedRoom) => {
                            return (
                                <SelectedRoom room={selectedRoom} key={selectedRoom._id}
                                    handleClick={() => handleRemoveRoom(selectedRoom)}></SelectedRoom>
                            )
                        })
                    }
                </div>
                {
                    selectedRooms.length > 0 && <CustomAlertDialog message='You may want to contact Administrator for confirmation and approval to register as room manager.' handleClick={handleSubmit} positive ></CustomAlertDialog>
                }
            </div>
            <Toaster position='top-right' />
        </div >
    );
}

export default RoomRegisterTab;