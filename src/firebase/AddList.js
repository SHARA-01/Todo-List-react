import { doc, setDoc } from "firebase/firestore";
import { collection } from "./HandleLogin";
import { db } from "./firebase";


const predefinedTaskColumns = {
    Daily: {
        id: '01',
        title: 'Daily Task',
        items: []
    },
    Important: {
        id: '02',
        title: 'Important Task',
        items: []
    },
    Urgent: {
        id: '03',
        title: 'Urgent Task',
        items: []
    }
};

const addtodolistbyName = async (uid, playlistTitle) => {
    try {
        const userTodoListRef = collection(db, 'toDoList', uid, 'ToDoLists');
        console.log(uid, playlistTitle)
        const playlistRef = doc(userTodoListRef, playlistTitle);
        await setDoc(playlistRef, {
            title: playlistTitle,
        });

        const taskListRef = collection(playlistRef, 'taskList');
        for (const [key, value] of Object.entries(predefinedTaskColumns)) {
            await setDoc(doc(taskListRef, key), value);
        }

        console.log('Playlist initialized successfully');
    } catch (error) {
        console.log(uid, playlistTitle)

        console.error('Error initializing playlist: ', error);
    }
}

export { addtodolistbyName, doc, setDoc }
