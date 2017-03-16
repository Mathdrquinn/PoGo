const pogobuf = require('pogobuf');
const POGOProtos = require('node-pogo-protos');
const bluebird = require('bluebird');
const { Point } = require('./classses/point');
const { S2Cell } = require('./classses/S2Cell');
const walker = require('./util/walk');
const {
    getWayFinderLocations,
    getRecentWayFinderLocations,
    watchWayFinderLocations,
    saveWayFinderLocation,
    getPokemon,
    savePokemon
} = require('./util/firebase');
console.log(Point, S2Cell)

const [username, password] = process.argv.splice(2);
const hashingKey = '5O9M8L7U3P7B7K8N6M6R' || process.env.HASHING_KEY;
// HOME
const home = new Point(39.910631, -86.051998, 'home');
const cornerPoint = new Point(39.910626, -86.052767, 'corner');
const triplePoint = new Point(39.909579, -86.052864, 'triple');
const creekPoint = new Point(39.908863, -86.052810, 'creek');
const pokeStopPoint = new Point(39.908531, -86.051480, 'pokeStop');
const hotSpotPoint = new Point(39.909829, -86.051115, 'hot spot');
const entrancePoint = new Point(39.910713, -86.051153, 'entrance');
const secondEntrancePoint = new Point(39.910673, -86.050241, 'second entrance');
const secondHotSpotPoint = new Point(39.910347, -86.049157, 'second hot spot');
const LakeCornerPoint = new Point(39.909648, -86.049549, 'lake corner');
const LakePoint = new Point(39.909846, -86.050332, 'lake');

// NextGear
const nextGearEntrance = new Point(39.961135597532966, -86.14610552787781);
const pond = new Point(39.960716200743626, -86.14465981721878);

console.log(`Logging in to PTC with ${username} and ${password}`);

const ptcLogin = new pogobuf.PTCLogin();
const googleLogin = new pogobuf.GoogleLogin();
let client;

const addStep = (point) => {
    return saveWayFinderLocation(point);
}

const addMon = (point, pokemonNumber) => {
    return savePokemon(pokemonNumber, new Date().getTime() + 360000, point);
}

const init = () => {
    return client.init()
        .catch((err) => {
            console.log('Error with init:', err);
            console.log('Retrying.....');
            return init();
        });
}

const ptcSignIn = (user, pass) => {
    console.log('BEGIN LOGIN');
    return ptcLogin.login(username, password)
        .catch((error) => {
            console.log('-----  BEGIN ERROR  -----')
            console.log(error.status_code);
            console.log(Object.keys(error));
            console.log(error);
            console.log('-----  END ERROR  -----')
            console.log('\nRetry login...')
            return ptcSignIn(user, pass);
        });
}

const loginWithPTC = (user, pass) => {
    return ptcSignIn(user, pass)
        .then(token => {
            console.log(`\n!!!!!!!!!!  SIGN IN SUCCESS !!!!!!!!!!`);
            console.log(`Your token is: ${token}`);
            client = new pogobuf.Client({
                version: 5703, // Use API version 0.51 (minimum version for hashing server)
                useHashingServer: true,
                hashingKey: hashingKey,
                authToken: token,
                authType: 'ptc',
                maxTries: 10,
                downloadSettings: false,
            });
            setClientPosition(nextGearEntrance);
            return init();
        })
}

const googleSignIn = (user, pass) => {
    console.log('BEGIN LOGIN');
    return googleLogin.login(username, password)
        .catch((error) => {
            console.log('-----  BEGIN ERROR  -----')
            console.log(error.status_code);
            console.log(Object.keys(error));
            console.log(error);
            console.log('-----  END ERROR  -----')
            console.log('\nRetry login...')
            return googleSignIn(user, pass);
        });
}

const loginWithGoogle = () => {
    return googleSignIn(username, password)
        .then(token => {
            console.log(`\n!!!!!!!!!!  SIGN IN SUCCESS !!!!!!!!!!`);
            console.log(`Your token is: ${token}`);
            client = new pogobuf.Client({
                version: 5702, // Use API version 0.51 (minimum version for hashing server)
                useHashingServer: true,
                hashingKey: hashingKey
            });
            client.setAuthInfo('google', token);
            setClientPosition(nextGearEntrance);
            return init();
        })
}

const shitBroke = (error) => {
    console.log('Error', error);
    return;
};

const setClientPosition = (point, accuracy = 3, altitude = 245) => {
    const date = new Date();
    const lat = point.exactLat;
    const lng = point.exactLng;
    console.log('\nBegin setClientPosition -----------', point);
    console.log(`Setting position to lat: ${lat}, lng: ${lng}, at time: ${date.toTimeString()}`);

    client.setPosition(lat, lng, accuracy, altitude);
    return point;
};

const readInventory = () => {
    return Promise.resolve(client.getInventory(0))
        .then(inventory => {
            // Use the returned data
            console.log('\n%%%%%%%%%%%% INVENTORY %%%%%%%%%%%%%');
            console.log(inventory);
            if (!inventory.success) throw Error('success=false in inventory response');

            // Split inventory into individual arrays and log them on the console
            inventory = pogobuf.Utils.splitInventory(inventory);
            console.log('Full inventory:', inventory);

            console.log('Items:');
            inventory.items.forEach(item => {
                console.log(item.count + 'x ' +
                    pogobuf.Utils.getEnumKeyByValue(POGOProtos.Inventory.Item.ItemId, item.item_id));
            });
        })
        .catch((error) => {
            console.log('ERROR GETTING INVENTORY ^^^^^^^^^^^^^^^^^^^^');
            return Promise.reject(error);
        });

}

walker.onBegin((obj) => {
    console.log('BEGINNING\n', obj)
});
walker.onStep((obj) => {
    // console.log('Stepping\n', obj);
    addStep(obj.currentPt);
    // setClientPosition(obj.currentPt);
    listCatchablePokemon(obj.currentPt)();
    // addMon(obj.currentPt);
})
walker.onEnd((obj) => {
    console.log('ENDING\n', obj)
})

const wait = (sec) => {
    return () => {
        const p = new Promise((res, rej) => {
            setInterval(() => {
                res();
            }, sec * 1000);
        });

        return p;
    }
}

const listCatchablePokemon = (point) => {
    return () => {
        console.log('\nBegin listCatchablePokemon -----------', point.exactLat, point.exactLng);

        setClientPosition(point);

        const cellIDs = pogobuf.Utils.getCellIDs(point.lat, point.lng, 5, 17);
        return bluebird.resolve(client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0)))
            .then(mapObjects => {
                console.log('mapObjects', mapObjects)
                return mapObjects.map_cells;
            })
            .each(cell => {
                const s2Cell = new S2Cell(cell);
                console.log('cell', cell);
                if (cell.catchable_pokemons.length) {
                    console.log(`---------- BEGIN POKEMON AT ${point.name} LAT: ${s2Cell.lat} LNG: ${s2Cell.lng} ----------`);
                    console.log('Cell ' + cell.s2_cell_id.toString());
                    console.log('Has ' + cell.catchable_pokemons.length + ' catchable Pokemon');
                }
                return bluebird.resolve(cell.catchable_pokemons)
                    .each(catchablePokemon => {
                        console.log(' - A ' + pogobuf.Utils.getEnumKeyByValue(POGOProtos.Enums.PokemonId, catchablePokemon.pokemon_id) + ' is asking you to catch it.');
                        addMon(new Point(s2Cell.lat, s2Cell.lng), POGOProtos.Enums.PokemonId)
                    });
            })
            .catch(err => {
                console.log('SOMETHING BAD!', err);
                return Promise.reject(err);
            });
    }
};



loginWithPTC(username, password)
    // .then(() => readInventory())
    .then(wait(30))
    .then(() => {
        return walker.walkPath([home, cornerPoint, creekPoint, pokeStopPoint, home], 2);
    })
    // .then(listCatchablePokemon(home))
    // .then(listCatchablePokemon(cornerPoint))
    // .then(listCatchablePokemon(triplePoint))
    // .then(listCatchablePokemon(creekPoint))
    // .then(listCatchablePokemon(pokeStopPoint))
    // .then(listCatchablePokemon(hotSpotPoint))
    // .then(listCatchablePokemon(entrancePoint))
    .then(() => {
        console.log('THE END');
    })
    .catch(shitBroke);
