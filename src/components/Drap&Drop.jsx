import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updatedragTodoList } from '../firebase/firebase';
import { Slide, toast } from 'react-toastify';

function DragDrop({ taskColumbs, ListName, userUid, ListId, onChangeONDragTask, taskPriority, listTaskAddedStatus, onlistTaskAddedStatu }) {
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

    const findItemById = (id, columns) => {
        for (const columnId in columns) {
            const column = columns[columnId];
            const item = column.items.find(item => item.id === id);
            if (item) {
                return item;
            }
        }
        return null;
    };


    const onDragStart = (start) => {
        const { source, draggableId } = start;
        taskPriority(source?.droppableId)
        const item = findItemById(draggableId, taskColumb); // Implement findItemById to locate the item in taskColumb
        onChangeONDragTask(item);
    };


    const onDragEnd = (result, taskColumb, setTaskColumb) => {
        if (!result.destination && listTaskAddedStatus !== false) {
            const { source } = result;
            const sourceColumn = taskColumb[source.droppableId];
            console.log('source col', sourceColumn)
            const sourceItems = [...sourceColumn.items]
            console.log('source items', sourceItems)
            const [removed] = sourceItems.splice(source.index, 1);
            setTaskColumb({
                ...taskColumb, [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                }
            })
            toast.warn('list task removed successfully')
            onlistTaskAddedStatu(false)
            taskPriority('')
            setIsListUpdated(true)
            return;
        }

        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = taskColumb[source.droppableId];
            const destColumn = taskColumb[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            onChangeONDragTask('')
            taskPriority('')
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
            onChangeONDragTask('')
            taskPriority('')
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
        <DragDropContext onDragStart={onDragStart} onDragEnd={(result) => onDragEnd(result, taskColumb, setTaskColumb)}>
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
                                                <div className='px-4 py-2 flex flex-col justify-between w-full hover:bg-gray-200 hover:rounded-md cursor-grab ' >
                                                    <h1>{item?.title}</h1>
                                                    <h2>{item?.Task_des}</h2>
                                                    <span className='text-gray-500'>{new Date(item?.due_date).toLocaleDateString('en-us', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    })}</span>
                                                    <span>
                                                        {column?.title}
                                                    </span>
                                                </div >
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
