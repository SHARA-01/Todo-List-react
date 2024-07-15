import React, { useContext, useEffect } from 'react'
import { StateContext } from '../../context/adminContext'
import { fetchTasksForPlaylist } from '../../firebase/fetchListData';


function Tasks() {
    const { tasks, setTasks, taskLists } = useContext(StateContext);
    useEffect(() => {
        const fetch = () => {
            const taskList = [];
            taskLists[0]?.forEach(async (item) => {
                const res = await fetchTasksForPlaylist(item?.uid, item?.title);
                taskList.push(res)
            })
            setTasks(taskList)
        }
        fetch()
    }, [taskLists])


    return (
        // <div>
        //     <table className='w-full flex flex-col'>
        //         <thead>
        //             <tr className='flex w-full border rounded-md shadow-md py-2 px-5 text-gray-600 text-center bg-white sticky top-px'>
        //                 <th className='w-1/5 text-left'>TaskList Title</th>
        //                 <th className='w-1/5'>Creadted By</th>
        //                 <th className='w-1/5'>No of Tasks</th>
        //                 <th className='w-1/5'>Creation Time</th>
        //                 <th className='w-1/5'>Last Updated</th>
        //             </tr>
        //         </thead>
        //         <tbody>{
        //             tasks?.forEach(item => {
        //                 console.log(item)
        //                 Object.entries(item).forEach(value => {
        //                     console.log(value)
        //                     value[1].items?.map((data, index) => (
        //                         <tr key={index}>
        //                             {console.log('data', data)}
        //                             <td>{data?.title}</td>
        //                             {/* <td>{data.createdBy}</td> */}
        //                             {/* <td>{data.totalTasks}</td> */}
        //                             {/* <td>{new Date(data.createdAt).toLocaleDateString('en-us', {
        //                                 month: 'short',
        //                                 day: '2-digit',
        //                                 year: 'numeric',
        //                             })}</td> */}
        //                             {/* <td>{new Date(data.updatedAt).toLocaleDateString('en-us', {
        //                                 month: 'short',
        //                                 day: '2-digit',
        //                                 year: 'numeric',
        //                             })}</td> */}
        //                         </tr>
        //                     ))
        //                 })
        //             })}
        //         </tbody>
        //     </table>
        // </div >
        <div>
            Tasks page
        </div>
    )
}

export default Tasks