import { arrayUnion, updateDoc } from 'firebase/firestore';
import { doc } from './AddList'
import { v4 as uuidv4 } from 'uuid'
import { db } from './firebase';
import { collection } from './HandleLogin';

const addTaskToTaskColumn = async ({ uid, toDoListName, columnName, taskTitle, taskDes, DueDate, taskPriority }) => {
    try {
        const taskId = uuidv4();
        const taskColumnRef = doc(db, 'toDoList', uid, 'ToDoLists', toDoListName, 'taskList', columnName);
        const res = await updateDoc(taskColumnRef, {
            items: arrayUnion({ id: taskId, title: taskTitle, Task_des: taskDes, due_date: DueDate, task_priority: taskPriority, createdAt: new Date() })
        });
        const userTodoListRef = collection(db, 'toDoList', uid, 'ToDoLists');
        const playlistRef = doc(userTodoListRef, toDoListName);
        await updateDoc(playlistRef, {
            updatedAt: new Date()
        });
        console.log('task add successfully')

    } catch (error) {
        console.log(error)
    }
}



export { addTaskToTaskColumn, updateDoc }