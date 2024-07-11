import { arrayUnion, updateDoc } from 'firebase/firestore';
import { doc } from './AddList'
import { v4 as uuidv4 } from 'uuid'
import { db } from './firebase';

const addTaskToTaskColumn = async ({ uid, toDoListName, columnName, taskTitle, taskDes, DueDate, taskPriority }) => {
    try {
        const taskId = uuidv4();
        const taskColumnRef = doc(db, 'toDoList', uid, 'ToDoLists', toDoListName, 'taskList', columnName);
        await updateDoc(taskColumnRef, {
            items: arrayUnion({ id: taskId, title: taskTitle, Task_des: taskDes, due_date: DueDate, task_priority: taskPriority })
        });
        console.log('task add successfully')

    } catch (error) {
        console.log(uid, toDoListName, columnName, taskTitle, taskDes, DueDate, taskPriority)
        console.log(error)
    }
}

export { addTaskToTaskColumn }