import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

const TaskCard = ({ item, index }) => {
    return (
        <Draggable key={item?.id} draggableId={item?.id} index={index}  >
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='px-4 py-2 flex justify-between w-full hover:bg-gray-200 hover:rounded-md cursor-grab'>
                    <h1>{item?.title}</h1>
                    <span className='text-gray-500'>{new Date(item?.due_date).toLocaleDateString('en-us', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                    })}</span>
                </div >
            )}
        </Draggable >
    )
}

export default TaskCard;