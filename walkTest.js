const firebase = require('firebase');
const walker = require('./util/walk');
const { Point } = require('./point');
const uuid = require('uuid/v1');

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

// wayFinderRef.on('value')
//     .then((snapshot) => {
//         const wayFinder = snapshot.val();
//         const locations = snapshot.child('locations').val(); // [ Points]
//         console.log(wayFinder);
//         console.log(locations);
//     });
//
// const newPokemonId = pokemonRef.push({
//     number: 2,
//     lat: 234,
//     lng: 456,
// }).key;

const home = new Point(39.910631, -86.051998, 'home');
const cornerPoint = new Point(39.910626, -86.052767, 'corner');
const triplePoint = new Point(39.909579, -86.052864, 'triple');
const pokeStopPoint = new Point(39.908531, -86.051480, 'pokeStop');

const firebaseToArray = (listSnapshot) => {
    const array = [];
    listSnapshot.forEach((childSnapshot) => {
        var key = childSnapshot.key;
        var child = childSnapshot.val();
        array.push(Object.assign(child, { key }))
    });
    return array;
}

const addStep = (point) => {
    const locationsRef = wayFinderRef.child('locations');
    locationsRef
        .orderByChild('time')
        .once('value')
        .then((snapshot) => {
            const locations = firebaseToArray(snapshot).sort((x, y) => y.time-x.time);
            console.log(locations)
            if (locations.length > 7) {
                const oldestPt = locations.pop(-1);

                console.log('about to delete:', oldestPt);

                return rootRef.child(`walker/locations/${oldestPt.key}`).remove()
                    .then(() => locationsRef.push({
                        lat: point.exactLng,
                        lng: point.exactLng,
                        time: new Date().getTime(),
                    }))
                    .catch((err) => console.log('deletion error: ', err));
            }

            return locationsRef.push({
                lat: point.exactLat,
                lng: point.exactLng,
                time: new Date().getTime(),
            });
        })
        .catch((err) => console.log('deletion error: ', err));
}

walker.onBegin((obj) => {
    console.log('BEGINNING\n', obj)
});
walker.onStep((obj) => {
    console.log('Stepping\n', obj);
    addStep(obj.currentPt);
})
walker.onEnd((obj) => {
    console.log('ENDING\n', obj)
})
walker.walk(home, cornerPoint, 2);
