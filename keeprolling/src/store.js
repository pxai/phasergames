import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc } from 'firebase/firestore/lite';


const firebaseApp = initializeApp({
    apiKey: "sadf",
    authDomain: "ddd.firebaseapp.com",
    projectId: "ddd",
    storageBucket: "ddd.appspot.com",
    messagingSenderId: "222",
    appId: "1:222:web:3333"
});
const db = getFirestore(firebaseApp);

const readData =  async function () {
    try {
        const games = collection(db, 'games');
        const gamesSnapshot = await getDocs(games);
        const gamesList = gamesSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
        return gamesList;
    } catch (error) {
        console.log("Error getting data: ", error)
        return [];
    }
}

const saveData = async function (score, player = "Anonymous", game = "KeepRolling") {
    try {
        const doc = await addDoc(collection(db, "games"), {score, player, game});
        return doc.id;
    } catch (error) {
        console.log('error creating the data', error.message);
    }
}

export {readData, saveData };