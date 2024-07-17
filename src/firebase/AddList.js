import { doc, setDoc } from "firebase/firestore";
import { collection } from "./HandleLogin";
import { db } from "./firebase";


const predefinedTaskColumns = {
    'Meduim Priority': {
        id: '02',
        title: 'Meduim Priority',
        items: []
    },
    'Low Priority': {
        id: '01',
        title: 'Low Priority',
        items: []
    },
    'Hign Priority': {
        id: '03',
        title: 'Hign Priority',
        items: []
    }
};

const addtodolistbyName = async (uid, playlistTitle, userEmail) => {
    try {
        const userTodoListRef = collection(db, 'toDoList', uid, 'ToDoLists');
        const playlistRef = doc(userTodoListRef, playlistTitle);
        await setDoc(playlistRef, {
            title: playlistTitle,
            createdBy: userEmail,
            uid: uid,
            createedAt: new Date(),
            updatedAt: new Date()
        });
        const taskListRef = collection(playlistRef, 'taskList');
        for (const [key, value] of Object.entries(predefinedTaskColumns)) {
            await setDoc(doc(taskListRef, key), value);
        }
    } catch (error) {
        console.error('Error initializing playlist: ', error);
    }
}

export { addtodolistbyName, doc, setDoc }
