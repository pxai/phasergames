import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';


const firebaseApp = initializeApp({
    apiKey: "AIzaSyA3OMGAeWL9qG3tviU1beMQtYYwoVtOoIk",
    authDomain: "greedywillie.firebaseapp.com",
    projectId: "greedywillie",
    storageBucket: "greedywillie.appspot.com",
    messagingSenderId: "74983734582",
    appId: "1:74983734582:web:76a2a929b5d9647a744797"
});
const db = getFirestore(firebaseApp);



const readData =  async function (db) {
    const citiesCol = collection(db, 'games');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    console.log("Got data: ", cityList)
    return cityList;
}

function saveData (playerName, data) {
    console.log("Saving data: ", playerName)
}

export {readData };