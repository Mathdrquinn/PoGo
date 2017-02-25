const firebase = require('firebase');

const config = {
    apiKey: "AIzaSyDCkcF_UC-4YfHVDgG8FOwCZ4vkp5n8b68",
    authDomain: "poke-walk-5ee21.firebaseapp.com",
    databaseURL: "https://poke-walk-5ee21.firebaseio.com",
    storageBucket: "poke-walk-5ee21.appspot.com",
    messagingSenderId: "346364451926"
};

const app = firebase.initializeApp(config);
const database = app.database();
const rootRef = firebase.database().ref();

const wayFinderRef = rootRef.child('walker');

const pokemonRef = rootRef.child('pokemon');


const firebaseToArray = (listSnapshot) => {
    const array = [];
    listSnapshot.forEach((childSnapshot) => {
        var key = childSnapshot.key;
        var child = childSnapshot.val();
        array.push(Object.assign(child, { key }))
    });
    return array;
}

const getWayfinder = () => {
    return wayFinderRef
        .once('value')
        .then((snapshot) => snapshot.val())
        .catch(err => console.log(err));
}

const getWayFinderLocations = () => {
    return wayFinderRef.child('locations')
        .orderByChild('time')
        .once('value')
        .then((snapshot) => snapshot.val())
        .catch(err => console.log(err));
}

const watchWayFinderLocations = () => {
    return wayFinderRef.child('locations')
        .orderByChild('time')
        .on('value')
        .then((snapshot) => firebaseToArray)
        .catch(err => console.log(err));
}

const deleteWayFinderLocation(key) => {
    return wayFinderRef.child(`locations/${key}`)
        .remove()
        .catch(err => console.log(err));
}