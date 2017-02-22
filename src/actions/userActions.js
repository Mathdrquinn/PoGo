import pogobuf from 'pogobuf';
// const POGOProtos = require('node-pogo-protos');
// console.log(POGOProtos());
import Position from '../utils/Position';
const home = new Position(39.910357, -86.052457);

// const ptcLogin = new pogobuf.PTCLogin();
// const client = new pogobuf.Client();

function signInUserSuccess(token, position) {
    return { type: 'USER_SIGN_IN_SUCCESS', token, position };
}

function signInUserLoading() {
    return { type: 'USER_SIGN_IN_LOADING' };
}

function signInUserError() {
    return { type: 'USER_SIGN_IN_ERROR' };
}

function setPosition(position) {
    client.setPosition(lat, lng);
    return {
        type: 'USER_SET_POSITION',
        position,
    };
}

function attemptLogin(username, password) {
    return PTCLogin.login(username, passwrod)
        .catch((error) => {
            console.error('-----  BEGIN ERROR  -----')
            console.log(error.status_code);
            console.log(error.message);
            console.log(error);
            console.error('-----  END ERROR  -----')
            console.log('\nRetry login...\n')
            dispatch(signInUserError());
            return attemptLogin(username, password);
        })
}

function login(username, password) {
    dispatch(signInUserLoading());

    return attemptLogin(username, password)
        .then(token => {
            console.log('Got Token!')
            client.setAuthInfo('ptc', token);
            setPosition(home);
            dispatch(signInUserSuccess(token, home));
            return client.init();
        })
}

function signInUser(username, passwrod) {
    PTCLogin.login(username, passwrod)
        .catch((error) => {
            console.log('Secondary Error logging in...', error);
            return error;
        })
        .then(() => {
            // Make some API calls!
            return client.getInventory(0);
        })
        .then(inventory => {
            // Bad
            if (!inventory.success) throw Error('success=false in inventory response');

            // Good
            console.log('Got Inventory!! Yay!', inventory);
            // Split inventory into individual arrays and log them on the console
            // inventory = pogobuf.Utils.splitInventory(inventory);
            console.log('Full inventory:', inventory);

            console.log('Items:');
            // inventory.items.forEach(item => {
            //     console.log(item.count + 'x ' +
            //         pogobuf.Utils.getEnumKeyByValue(POGOProtos.Inventory.Item.ItemId, item.item_id));
            // });
        })
        .catch(console.error);
    // return function signInThunk(dispatch) {
    //     dispatch(signInUserLoading());
    //     signInWithPopUp()
    //         .then((result) => {
    //             console.log('sign-in success!', result);
    //             const { uid, displayName, email, photoURL, refreshToken } = result.user;
    //             const { accessToken, idToken, provider } = result.credential.accessToken;
    //             dispatch(signInUserSuccess(uid, accessToken, idToken, provider, refreshToken, displayName, email, photoURL))
    //         })
    //         .catch((error) => {
    //             console.log('sign-in error', error);
    //             // Handle Errors here.
    //             var errorCode = error.code;
    //             var errorMessage = error.message;
    //             // The email of the user's account used.
    //             var email = error.email;
    //             // The firebase.auth.AuthCredential type that was used.
    //             var credential = error.credential;
    //             dispatch(signInUserError());
    //         });
    // }
}

function signOutUserSuccess() {
    return { type: 'USER_SIGN_OUT_SUCCESS' };
}

function signOutUserLoading() {
    return { type: 'USER_SIGN_OUT_LOADING' };
}

function signOutUserError() {
    return { type: 'USER_SIGN_OUT_ERROR' };
}

function signOutUser() {
    // return function signOutThunk(dispatch) {
    //     dispatch(signOutUserLoading());
    //     signOut()
    //         .then((response) => {
    //             console.log('signOut success!', response);
    //             dispatch(signOutUserSuccess());
    //         })
    //         .catch((error) => {
    //             console.log('signOut error', error);
    //             dispatch(signOutUserError());
    //         })
    // };
}

export { signInUser, signOutUser };

// const pogobuf = require('pogobuf'),
//     POGOProtos = require('node-pogo-protos'),
//     bluebird = require('bluebird');
//
// // Note: To avoid getting softbanned, change these coordinates to something close to where you
// // last used your account
// const lat = 37.7876146,
//     lng = -122.3884353;
//
// const username = 'your-google-username',
//     password = 'your-google-password',
//     hashingKey = 'your-pogodev-hashing-key';
//
// let client;
//
// new pogobuf.GoogleLogin().login(username, password).then(token => {
//     au
//     client.setPosition(lat, lng);
//     return client.init();
// }).then(() => {
//     console.log('Authenticated, waiting for first map refresh (30s)');
//     setInterval(() => {
//         const cellIDs = pogobuf.Utils.getCellIDs(lat, lng, 5, 17);
//         return bluebird.resolve(client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0))).then(mapObjects => {
//             return mapObjects.map_cells;
//         }).each(cell => {
//             console.log('Cell ' + cell.s2_cell_id.toString());
//             console.log('Has ' + cell.catchable_pokemons.length + ' catchable Pokemon');
//             return bluebird.resolve(cell.catchable_pokemons).each(catchablePokemon => {
//                 console.log(' - A ' + pogobuf.Utils.getEnumKeyByValue(POGOProtos.Enums.PokemonId,
//                         catchablePokemon.pokemon_id) + ' is asking you to catch it.');
//             });
//         });
//     }, 30 * 1000);
// }).catch(console.error);