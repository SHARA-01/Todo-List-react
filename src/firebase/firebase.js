import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, query, getDocs, collection, where, addDoc, doc, setDoc, writeBatch, updateDoc, arrayUnion } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'
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


const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

const registerWithEmailAndPassword = async ({ name, email, password }) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
    return { status: 200 }
  } catch (err) {
    console.log(err)
    alert(err.message)
  }
}

const logOut = () => {
  signOut(auth);
}

const getQuery = async (queryData) => {
  const docRef = doc(db, 'todoList')
  const res = query(docRef, where("uid" === queryData))
  console.log('querry res', res);
}


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

const fetchUserPlaylists = async (uid) => {
  try {
    const playlistsRef = collection(db, 'toDoList', uid, 'ToDoLists');
    const playlistsSnapshot = await getDocs(playlistsRef);
    const playlists = [];
    console.log(playlistsSnapshot)
    playlistsSnapshot.forEach((doc) => {
      playlists.push({ id: doc.id, ...doc.data() });
    });
    return playlists;
  } catch (error) {
    console.error('Error fetching Todolists: ', error);
    throw error;
  }
};

const fetchTasksForPlaylist = async (uid, playlistTitle) => {
  try {
    const taskListRef = collection(db, 'toDoList', uid, 'ToDoLists', playlistTitle, 'taskList');
    const taskListSnapshot = await getDocs(taskListRef);
    const tasks = {};
    console.log(taskListSnapshot)
    taskListSnapshot.forEach((doc) => {
      tasks[doc.id] = doc.data();
    });
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks: ', error);
    throw error;
  }
};

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




export { updatedragTodoList, addTaskToTaskColumn, auth, db, logInWithEmailAndPassword, registerWithEmailAndPassword, logOut, fetchTasksForPlaylist, fetchUserPlaylists, getQuery, addtodolistbyName }

