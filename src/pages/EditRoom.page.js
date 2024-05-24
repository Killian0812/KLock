import { useEffect, useState } from "react"
import Tippy from "@tippyjs/react";
import HeadlessTippy from '@tippyjs/react/headless';
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Toaster, toast } from 'alert';
import { generateRegexQuery } from 'regex-vietnamese';
import debounce from 'lodash.debounce';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import CustomAlertDialog from '../components/AlertDialog.component';
import { useParams } from "react-router-dom";

const MAC_REGEX = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/

function SelectedManger({ user, handleClick }) {
    return (
        <div style={{ marginLeft: "10px", marginTop: "3px" }}>
            <div className="room-selected-button">
                <span>{user.username}</span>
                <button className='room-remove-selected-button' onClick={() => handleClick()}>
                    <RxCross2 style={{ marginBottom: "10px" }} /></button>
            </div>
        </div>
    )
}

export default function EditRoom() {

    const { roomId } = useParams();
    const [name, setName] = useState('');
    const [mac, setMac] = useState('');
    const [managers, setManagers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [validMac, setValidMac] = useState(false);
    const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]);
    const [err, setErr] = useState();
    const [changed, setChanged] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        setValidMac(MAC_REGEX.test(mac));
    }, [mac]);

    useEffect(() => {
        axiosPrivate.get('/api/admin/allUsers/').then(res => {
            setUsers(res.data);
        }).catch(error => {
            console.error('Error fetching users:', error);
            toast("Unexpected error");
        })
    }, [roomId, axiosPrivate]);

    useEffect(() => {
        axiosPrivate.get(`/api/admin/room/${roomId}`).then(res => {
            setName(res.data.name);
            setMac(res.data.mac);
            setManagers(users.filter(currentUser => res.data.managers.includes(currentUser._id)));
        }).catch(err => {
            console.error(err);
            toast("Unexpected error");
        })
    }, [roomId, axiosPrivate, users]);

    useEffect(() => {
        if (!keyword.trim()) {
            setVisible(false);
            return;
        }
        const regex = generateRegexQuery(keyword, {
            outputCaseOptions: 'both',
            ignoreAccentedVietnamese: true
        });
        const newResults = users.filter(user => regex.test(user.username) || regex.test(user.fullname))
        setResults(newResults);
    }, [keyword, users]);

    useEffect(() => {
        if (!results.length) {
            setVisible(false);
            return;
        }
        setVisible(true);
    }, [results])

    const handleSearching = debounce((e) => {
        setKeyword(e);
    }, 300);

    const handleAddUser = (user) => {
        setManagers(prevManagers =>
            prevManagers.some(currentManager => currentManager._id === user._id) ?
                prevManagers : [...prevManagers, user])
    }

    const handleRemoveUser = (user) => {
        setManagers(prevManagers => prevManagers.filter(currentManager => currentManager._id !== user._id));
    }

    const handleSubmit = () => {
        axiosPrivate.post(`/api/admin/room/${roomId}`, {
            name: name,
            mac: mac,
            managers: managers
        }).then(() => {
            toast(`Room updated`);
        }).catch((err) => {
            if (err.response.status === 400) {
                if (err.response.data.exist === 1)
                    setErr('Room with the same Device MAC Address already exist')
                else
                    setErr('Room with the same name already exist')
            }
            else
                toast('Unexpected error');
        })
    }

    return (
        <div className='MainContainer'>
            <section className="contentSection">
                <h1>Edit Room</h1><hr></hr>
                <div className="tabs-wrapper">
                    <div className="input-group">
                        <label htmlFor="name">Room name:</label>
                        <input id="name" value={name} onChange={(e) => {
                            setName(e.target.value)
                            setChanged(true);
                        }} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="mac">Device MAC Address:</label>
                        <Tippy content={`Must be a valid MAC address ${mac ? (validMac ? '✅' : '❌') : ''}`}
                            placement="right" trigger="focus" interactive={true} hideOnClick={false}>
                            <input id="mac" value={mac} onChange={(e) => {
                                setMac(e.target.value)
                                setChanged(true)
                            }} />
                        </Tippy>
                    </div>
                    {
                        err &&
                        <div style={{ marginTop: '10px' }}>
                            <span style={{ color: 'red', fontSize: '20px' }}>{err}</span>
                        </div>
                    }
                    <div style={{ display: "flex", marginTop: '30px', fontSize: '20px' }}>
                        <div style={{ flex: 0.8, borderRight: "1px solid #fff", paddingRight: "10px" }}>
                            <HeadlessTippy visible={visible} onClickOutside={() => setVisible(false)} interactive placement="bottom-end"
                                render={attrs => (
                                    <div className='room-search-wrapper' tabIndex="-1" {...attrs}>
                                        <div className='room-search-list'>
                                            {
                                                results.map((result) => {
                                                    return (
                                                        <button className='room-search-item'
                                                            onClick={() => {
                                                                handleAddUser(result)
                                                                setChanged(true)
                                                            }}
                                                            key={result._id}>{result.fullname || result.username}</button>)
                                                })
                                            }
                                        </div>
                                    </div>
                                )}>
                                <div>
                                    <FaSearch style={{ margin: '-5px 8px -7px 0' }} size={36} />
                                    <input style={{
                                        flex: 1, border: "none", borderRadius: "5px", fontSize: '20px',
                                        outline: "none", padding: "5px", backgroundColor: "#434343", color: "#fff"
                                    }} type='text' placeholder='Search for manager'
                                        onChange={(e) => handleSearching(e.target.value)}></input>
                                </div>
                            </HeadlessTippy>
                        </div>
                        <div style={{ flex: 1 }}>
                            Selected managers:<br></br>
                            <div style={{ marginTop: '20px', marginLeft: '10px', display: 'flex', flexWrap: 'wrap' }}>
                                {
                                    managers.map((manager) => {
                                        return (
                                            <SelectedManger user={manager} key={manager._id}
                                                handleClick={() => {
                                                    handleRemoveUser(manager)
                                                    setChanged(true)
                                                }}
                                            ></SelectedManger>
                                        )
                                    })
                                }
                            </div>
                            {
                                changed && <CustomAlertDialog
                                    message='This action will modify the room details, including room name, device MAC address, and room managers.' buttonText='Save' positive
                                    handleClick={handleSubmit}></CustomAlertDialog>
                            }
                        </div>
                    </div >
                </div>
            </section>
            <Toaster position='top-right' />
        </div>
    )
}
