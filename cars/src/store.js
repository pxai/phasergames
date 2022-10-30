import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc } from 'firebase/firestore/lite';


const firebaseApp = initializeApp({
    apiKey: "AIzaSyA3OMGAeWL9qG3tviU1beMQtYYwoVtOoIk",
    authDomain: "greedywillie.firebaseapp.com",
    projectId: "greedywillie",
    storageBucket: "greedywillie.appspot.com",
    messagingSenderId: "74983734582",
    appId: "1:74983734582:web:76a2a929b5d9647a744797"
});
const db = getFirestore(firebaseApp);
console.log("FIRESTORE started: ", db)



const readData =  async function () {
    try {
        const games = collection(db, 'games');
        const gamesSnapshot = await getDocs(games);
        const gamesList = gamesSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
        console.log("Got data: ", gamesList)
        return gamesList;
    } catch (error) {
        console.log("Error getting data: ", error)
        return [];
    }
}

const saveData = async function (score, player = "Anonymous", game = "Make Way!!!") {  
    try {
        const doc = await addDoc(collection(db, "games"), {score, player, game});
        console.log("Dale, salvado: ", doc.id)
        return doc.id;
    } catch (error) {
        console.log('error creating the data', error.message);
    }
}

export {readData, saveData };