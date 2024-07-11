import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc } from './AddList';
import { collection } from "./HandleLogin";


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
    console.log('data update successfully to firebase')

  } catch (error) {
    console.log('there is some problem to add drag and drop update list data to firebase', error)
  }
}




export { updatedragTodoList, auth, db, logOut }

