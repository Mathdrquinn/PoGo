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

const getWayFinder = () => {
    return wayFinderRef
        .once('value')
        .then((snapshot) => snapshot.val())
        .catch(err => console.log(err));
}

const getWayFinderLocations = () => {
    return wayFinderRef.child('locations')
        .orderByChild('timestamp')
        .once('value')
        .then((snapshot) => snapshot.val())
        .catch(err => console.log(err));
}

const getRecentWayFinderLocations = () => {
    return wayFinderRef.child('locations')
        .orderByChild('timestamp')
        .limitToFirst(10)
        .once('value')
        .then((snapshot) => snapshot.val())
        .catch(err => console.log(err));
}

const watchWayFinderLocations = (cb) => {
    return wayFinderRef.child('locations')
        .orderByChild('timestamp')
        .on('child_added', (snapshot) => {
            cb(Object.assign(snapshot.val(), {key: snapshot.key }));
        });
}

const saveWayFinderLocation = (pt) => {
    const lat = pt.exactLat;
    const lng = pt.exactLng;
    const time = new Date().getTime();

    return wayFinderRef.child('locations')
        .push({
            lat,
            lng,
            time,
            timestamp: -(time),
        })
        .catch((err) => console.log('Error saving most recent step:', err));;
}

const deleteWayFinderLocation = (key) => {
    return wayFinderRef.child(`locations/${key}`)
        .remove()
        .catch(err => console.log(err));
}

const getPokemon = () => {
    return pokemonRef
        .orderByChild('expires')
        .startAt(new Date().getTime())
        .on('value')
        .then((snapshot) => firebaseToArray)
        .catch(err => console.log(err));
}

const watchPokemon = (cb) => {
    return pokemonRef
        .orderByChild('expires')
        .on('child_added', (snapshot) => {
            cb(Object.assign(snapshot.val(), {key: snapshot.key }));
        });
}

const savePokemon = (number, expires, pt) => {
    return pokemonRef.push({
        number: number,
        expires,
        lat: pt.exactLat,
        lng: pt.exactLng,
        timestamp: -(new Date().getTime()),
    });
}

module.exports = {
    getWayFinder,
    getWayFinderLocations,
    getRecentWayFinderLocations,
    watchWayFinderLocations,
    saveWayFinderLocation,
    deleteWayFinderLocation,
    getPokemon,
    watchPokemon,
    savePokemon,
};
