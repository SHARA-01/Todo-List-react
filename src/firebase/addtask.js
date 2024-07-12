import { arrayUnion, setDoc, updateDoc } from 'firebase/firestore';
import { doc } from './AddList'
import { v4 as uuidv4 } from 'uuid'
import { db } from './firebase';

const addTaskToTaskColumn = async ({ uid, toDoListName, columnName, taskTitle, taskDes, DueDate, taskPriority }) => {
    try {
        const taskId = uuidv4();
        const taskColumnRef = doc(db, 'toDoList', uid, 'ToDoLists', toDoListName, 'taskList', columnName);
        const res = await updateDoc(taskColumnRef, {
            items: arrayUnion({ id: taskId, title: taskTitle, Task_des: taskDes, due_date: DueDate, task_priority: taskPriority })
        });
        console.log('task add successfully')

    } catch (error) {
        console.log(error)
    }
}

const addTaskColumAfterDelete = async ({ uid, toDoListName, columnName }) => {
    try {
        const taskId = uuidv4();
        const taskColumnRef = doc(db, 'toDoList', uid, 'ToDoLists', toDoListName, 'taskList', columnName);
        const res = await setDoc(taskColumnRef, {
            id: taskId,
            title: columnName,
            items: []
        });
        console.log('task column add successfully successfully')

    } catch (error) {
        console.log(error)
    }
}

export { addTaskToTaskColumn, updateDoc, addTaskColumAfterDelete }