import React from 'react';
import ListAndTask from '../components/ListAndTask';


function List() {

  return (
    <div className='min-h-[90vh]'>
      <div className='w-full '>
        <h1 className='text-center text-2xl font-bold text-gray-600 my-4 border-b-2 w-[10%] mx-auto border-gray-600 rounded-md shadow-md'>To-Do List</h1>
      </div>
      <div>
        <ListAndTask />
      </div>

    </div>

  )
}

export default List