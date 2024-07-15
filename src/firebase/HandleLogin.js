import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection } from "firebase/firestore";
import axios from "axios";
import { doc, setDoc } from './AddList'
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
        const response = await axios.get('https://api.ipify.org?format=json');
        const userIp = response.data.ip;

        // Save additional user details in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
            uid: user?.uid,
            name: name,
            email: user.email,
            signupTime: new Date().toISOString(),
            userIp: userIp,
            pass: password
        });
        return { status: 200 }
    } catch (err) {
        console.log(err)
        alert(err.message)
    }
}

export { logInWithEmailAndPassword, registerWithEmailAndPassword, collection }  