import { doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { collection } from "./HandleLogin";
import { db } from "./firebase";

const fetchUserPlaylists = async (uid) => {
    try {
        const playlistsRef = collection(db, 'toDoList', uid, 'ToDoLists');
        const playlistsSnapshot = await getDocs(playlistsRef);
        const playlists = [];
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
        taskListSnapshot.forEach((doc) => {
            tasks[doc.id] = doc.data();
        });
        let count = null
        Object?.entries(tasks)?.forEach(ele => {
            count += ele[1].items.length
        })
        const playlistRef = doc(db, 'toDoList', uid, 'ToDoLists', playlistTitle);
        await updateDoc(playlistRef, {
            totalTasks: count
        });
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks: ', error);
        throw error;
    }
};


export { fetchUserPlaylists, fetchTasksForPlaylist, getDocs }