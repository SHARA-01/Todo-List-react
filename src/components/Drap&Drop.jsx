import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updatedragTodoList } from '../firebase/firebase';
import { Slide, toast } from 'react-toastify';

function DragDrop({ taskColumbs, ListName, userUid }) {
    const [taskColumb, setTaskColumb] = useState(taskColumbs && taskColumbs);
    const [isListUpdated, setIsListUpdated] = useState(false);

    useEffect(() => {
        setTaskColumb(taskColumbs);
    }, [taskColumbs]);

    useEffect(() => {
        const updateData = async () => {
            if (userUid && ListName && taskColumb && isListUpdated) {
                try {
                    setIsListUpdated(false);
                    await updatedragTodoList({ uid: userUid, toDoListName: ListName, newList: taskColumb })
                    toast.success('Lists Task Updated', {
                        position: 'bottom-right',
                        autoClose: 1000,
                        transition: Slide
                    })
                } catch (error) {
                    console.error('Error updating tasks: ', error);
                }
            }
        };

        updateData();
    }, [taskColumb, userUid, ListName, isListUpdated]);

    const onDragEnd = (result, taskColumb, setTaskColumb) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = taskColumb[source.droppableId];
            const destColumn = taskColumb[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setTaskColumb({
                ...taskColumb,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems,
                },
            });
        } else {
            const column = taskColumb[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setTaskColumb({
                ...taskColumb,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems,
                },
            });
        }

        setIsListUpdated(true);
    };

    return (
        <DragDropContext onDragEnd={(result) => onDragEnd(result, taskColumb, setTaskColumb)}>
            <div className="flex justify-between react-beautiful-dnd-draggable">
                {taskColumb && Object.entries(taskColumb).map(([columnId, column]) => (
                    <Droppable key={columnId} droppableId={columnId}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="w-1/3 border-2 border-gray-400 p-3 my-2 mr-1 last:mr-0 rounded-md space-y-2"
                            >
                                <h1 className='px-2 font-semibold text-gray-600'>{column.title}</h1>
                                <span className='flex my-2'>
                                    <hr className='h-1 bg-gray-600 rounded-md mx-2 w-[15%]' />
                                    <hr className='h-1 bg-gray-600 rounded-md w-[3%]' />
                                </span>
                                {column?.items && column.items.map((item, index) => (
                                    <Draggable key={item?.id} draggableId={item?.id} index={index}>
                                        {(provided, snapsho) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className=" bg-white border rounded-md border-gray-400 "
                                            >
                                                <TaskCard item={item} index={index} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
}

export default DragDrop;
