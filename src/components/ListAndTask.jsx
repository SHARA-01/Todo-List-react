import React, { useEffect, useState } from 'react'
import DragDrop from './Drap&Drop';
import { onAuthStateChanged } from '../firebase/CheckAuth'
import { auth, } from '../firebase/firebase';
import { Bounce, toast } from 'react-toastify';
import { addtodolistbyName } from '../firebase/AddList';
import { addTaskToTaskColumn } from '../firebase/addtask';
import { fetchUserPlaylists, fetchTasksForPlaylist } from '../firebase/fetchListData';

function ListAndTask() {
    const [toDoList, setToDoList] = useState(null)
    const [listTitle, setListTitle] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDes, setTaskDes] = useState('');
    const [taskDue_date, setDueDate] = useState('');
    const [taskPriority, setPriority] = useState('Low Priority');
    const [selectTaskid, setSelectTaskId] = useState(null);
    const [TaskColumbs, setTaskcol] = useState(null);
    const [user, setUser] = useState(null)


    const addNewToDoList = async () => {
        if (listTitle !== '' && listTitle !== null) {
            await addtodolistbyName(user?.uid, listTitle);
            setListTitle('')
            toast.success('To-do list added successfully.')
            const fetchData = async () => {
                const res = await fetchUserPlaylists(user && user?.uid);
                setToDoList(res);
                setSelectTaskId(res && res[0]?.id)
                setTaskcol(null)
            }
            fetchData()
        } else {
            toast.error('List title empty. please enter List name.')

        }

    }



    const handleAddTask = async () => {
        if ((user !== null) && (selectTaskid !== null) && (taskTitle !== '') && (taskDue_date !== '') && (taskDes !== '')) {
            await addTaskToTaskColumn({ uid: user?.uid, toDoListName: selectTaskid, columnName: taskPriority, taskTitle: taskTitle, taskDes: taskDes, DueDate: taskDue_date, taskPriority: taskPriority })
            setDueDate('')
            setTaskTitle('')
            setTaskDes('')
            toast.success(`Task Added to List: ${selectTaskid}`)
            const fetchDataOfTasks = async () => {
                const res = await fetchTasksForPlaylist(user?.uid, selectTaskid);
                setTaskcol(res)
            }
            fetchDataOfTasks()

        } else {
            if (selectTaskid === null) {
                toast.error('please add a List first.')
            }
            else toast.error("All Input fields are required.")
        }
    }

    useEffect(() => {
        let usertemp = null;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                toast.success('User Log In Successfully', {
                    position: 'top-center',
                    autoClose: 2000,
                    transition: Bounce,
                    toastId: '1'
                })
                usertemp = user.uid;
                const res = await fetchUserPlaylists(usertemp);
                setToDoList(res);
                setSelectTaskId(res && res[0]?.id); // Set the first playlist's id as the selected task id
            } else {
                setUser('');
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            if (user && selectTaskid) {
                const res = await fetchTasksForPlaylist(user?.uid, selectTaskid);
                setTaskcol(res);
            } else {
                console.log('No data available', user?.uid, selectTaskid);
            }
        };

        fetch();
    }, [user, selectTaskid]);

    return (
        <div className='mx-12 my-5 '>
            <div className='flex justify-between space-x-1 '>
                <div className='w-1/2 border-2 border-gray-400 rounded-md p-3'>
                    <span className='flex justify-between'>
                        <h1 className='px-2 font-semibold text-gray-600'>To-Do Lists</h1>
                        <span className='flex space-x-1'>
                            <input onChange={(e) => setListTitle(e.target.value)} value={listTitle} placeholder='Enter List Title' type="text" className='border border-black/40 rounded-md px-3 py-1 shadow-black focus:outline-none focus:border-blue-500 focus:drop-shadow-xl text-gray-600' />
                            <button onClick={addNewToDoList} className=' border border-gray-200 px-3 py-1 rounded-md  text-white bg-blue-600 font-semibold hover:bg-white hover:text-blue-500 hover:border-blue-500 active:border-blue-500 active:text-white active:bg-blue-500' >Add</button>
                        </span>

                    </span>

                    <span className='flex my-2'>
                        <hr className='h-1 bg-gray-600 rounded-md mx-2 w-[15%]' />
                        <hr className='h-1 bg-gray-600 rounded-md w-[3%]' />
                    </span>
                    <ul className='grid grid-rows-5 grid-flow-col space-y-1 space-x-1'>
                        <li className='hidden'></li>
                        {
                            toDoList === null ? ' ' :
                                toDoList.map((item, index) => (
                                    <div key={item?.id}>
                                        <li onClick={() => setSelectTaskId(item?.id)} className={`border hover:bg-blue-500 hover:text-white rounded-md px-2 py-1 hover:ring-1 hover:ring-blue-400 ${selectTaskid === item?.id ? "bg-blue-500 text-white ring-1 ring-blue-500 font-semibold" : ''}`}>{item.title}</li>
                                    </div>
                                ))
                        }
                    </ul>
                </div>

                <div className='w-1/2 grid border-2 border-gray-400 rounded-md p-3'>
                    <h1 className='px-2 font-semibold text-gray-600'>Add New Task</h1>
                    <span className='flex my-2'>
                        <hr className='h-1 bg-gray-600 rounded-md mx-2 w-[15%]' />
                        <hr className='h-1 bg-gray-600 rounded-md w-[3%]' />
                    </span>
                    <ul>
                        <li className='flex flex-col space-y-4 py-3'>
                            <input onChange={(e) => setTaskTitle(e.target.value)} value={taskTitle} type="text" name="taskTitle" id="" placeholder='Task Title' className='border-b-2 border-black/40 rounded-md px-3 py-1 shadow-black focus:outline-none focus:border-blue-500 focus:drop-shadow-xl text-gray-600' />
                            <textarea name="" id="" onChange={(e) => setTaskDes(e.target.value)} value={taskDes} placeholder='Description' className='border-b-2 border-black/40 rounded-md px-3 py-1 focus:outline-none focus:border-blue-500 focus:drop-shadow-xl text-gray-600'></textarea>
                        </li>
                        <li className='flex px-3 mt-5 space-x-2'>
                            <label className='py-1 font-semibold text-gray-700' htmlFor="date">Due Date</label>
                            <input value={taskDue_date} onChange={(e) => setDueDate(e.target.value)} className='border-2 px-2 py-1 rounded-md border-black/40 focus:outline-none focus:border-blue-500 ' type="date" name="date" id="" placeholder='Task Title' />
                            <label className='py-1 font-semibold text-gray-700' htmlFor="task">Task Priority</label>
                            <select defaultValue={'Low Priority'} value={taskPriority} onChange={(e) => setPriority(e.target.value)} className='border-2 px-2 py-1 rounded-md border-black/40 focus:outline-none focus:border-blue-500 text-gray-600 font-semibold' name="Task Priority" id="">
                                <option value="Low Priority">Low</option>
                                <option value="Meduim Priority">Medium</option>
                                <option value="Hign Priority">Hign</option>
                            </select>
                            <button onClick={handleAddTask} className='border border-gray-200 px-3 py-1 rounded-md bg-blue-600 text-white font-semibold hover:bg-white hover:text-blue-500 hover:border-blue-500 active:border-blue-500 active:text-white active:bg-blue-500 '>Add</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                {
                    TaskColumbs === null ? '' : <DragDrop taskColumbs={TaskColumbs && TaskColumbs} ListName={selectTaskid && selectTaskid} userUid={user && user?.uid} />
                }
            </div>
        </div>
    )
}

export default ListAndTask