import { getDocs } from "firebase/firestore";
import { collection } from "./HandleLogin";
import { db } from "./firebase";

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


export { fetchUserPlaylists, fetchTasksForPlaylist }