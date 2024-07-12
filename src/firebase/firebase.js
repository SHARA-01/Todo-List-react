import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { deleteDoc, getFirestore } from 'firebase/firestore';
import { collection } from "./HandleLogin";
import { doc, setDoc } from './AddList';


const firebaseConfig = {
  apiKey: "AIzaSyCP1mJoDOCkoW9UcYYm2PQbEbjweWc4lOY",
  authDomain: "todolist-7ab65.firebaseapp.com",
  projectId: "todolist-7ab65",
  storageBucket: "todolist-7ab65.appspot.com",
  messagingSenderId: "220333160946",
  appId: "1:220333160946:web:0808cb21f0fabcc9a9536b",
  measurementId: "G-Y47ZL830X7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const logOut = () => {
  signOut(auth);
}

const updatedragTodoList = async ({ uid, toDoListName, newList }) => {
  const playlistRef = doc(db, 'toDoList', uid, 'ToDoLists', toDoListName);
  const taskListRef = collection(playlistRef, 'taskList');

  try {
    for (const [columnName, columnData] of Object.entries(newList)) {
      const columnRef = doc(taskListRef, columnName);
      await setDoc(columnRef, { items: columnData.items }, { merge: true });
    }
  } catch (error) {
    console.log(error)
  }
}

const deleteTaskFromTaskColumn = async ({ uid, toDoListName, columnName, taskId }) => {
  try {
    const taskDocRef = doc(db, 'toDoList', uid, 'ToDoLists', toDoListName, 'taskList', columnName, 'items', taskId);
    await deleteDoc(taskDocRef)
  } catch (error) {
    console.error('Error deleting task: ', error);
  }
};




export { updatedragTodoList, auth, db, logOut, deleteTaskFromTaskColumn }

