const pogobuf = require('pogobuf');
const POGOProtos = require('node-pogo-protos');
const bluebird = require('bluebird');
const { Point } = require('./point');
const { S2Cell } = require('./S2Cell');
console.log(Point, S2Cell)

const [username, password] = process.argv.splice(2);
const hashingKey = '3Q6D6I6F6O6Z5G9J8Z0E' || process.env.HASHING_KEY;
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

console.log(`Logging in to PTC with ${username} and ${password}`);

const ptcLogin = new pogobuf.PTCLogin();
let client;

const signIn = (user, pass) => {
    console.log('BEGIN LOGIN');
    return ptcLogin.login(username, password)
        .catch((error) => {
            console.log('-----  BEGIN ERROR  -----')
            console.log(error.status_code);
            console.log(error.message);
            console.log(error);
            console.log('-----  END ERROR  -----')
            console.log('\nRetry login...')
            return signIn(user, pass);
        });
}

const shitBroke = (error) => {
    console.log('Error', error);
    return;
};

const setClientPosition = (h, v) => {
    const date = new Date();
    console.log('\nBegin setClientPosition -----------');
    console.log(`Setting position to lat: ${h}, lng: ${v}, at time: ${date.toTimeString()}`);

    client.setPosition(h, v);
    return {
        lat: h,
        lng: v,
    };
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

const listCatchablePokemon = (point) => {
    return () => {
        console.log('\nBegin listCatchablePokemon -----------');

        setClientPosition(point.lat, point.lng);

        console.log('Authenticated, waiting for first map refresh (30s)');

        const p = new Promise((res, rej) => {
            setInterval(() => {
                const cellIDs = pogobuf.Utils.getCellIDs(point.lat, point.lng, 5, 17);
                res(bluebird.resolve(client.getMapObjects(cellIDs, Array(cellIDs.length).fill(0)))
                    .then(mapObjects => {
                        return mapObjects.map_cells;
                    })
                    .each(cell => {
                        const s2Cell = new S2Cell(cell);
                        if (cell.catchable_pokemons.length) {
                            console.log(`---------- BEGIN POKEMON AT ${point.name} LAT: ${s2Cell.lat} LNG: ${s2Cell.lng} ----------`);
                            console.log('Cell ' + cell.s2_cell_id.toString());
                            console.log('Has ' + cell.catchable_pokemons.length + ' catchable Pokemon');
                        }
                        return bluebird.resolve(cell.catchable_pokemons)
                            .each(catchablePokemon => {
                                console.log(' - A ' + pogobuf.Utils.getEnumKeyByValue(POGOProtos.Enums.PokemonId, catchablePokemon.pokemon_id) + ' is asking you to catch it.');
                            });
                    }))
            }, 30 * 1000);
        });

        return p;
    }
};

signIn(username, password)
    .then(token => {
        console.log(`\n!!!!!!!!!!  SIGN IN SUCCESS !!!!!!!!!!`);
        console.log(`Your token is: ${token}`);
        client = new pogobuf.Client({
            authType: 'ptc',
            authToken: token,
            version: 5100, // Use API version 0.51 (minimum version for hashing server)
            useHashingServer: true,
            hashingKey: hashingKey
        });
        setClientPosition(home.lat, home.lng);
        return client.init();
    })
    // .then(listCatchablePokemon(home))
    // .then(listCatchablePokemon(cornerPoint))
    // .then(listCatchablePokemon(triplePoint))
    // .then(listCatchablePokemon(creekPoint))
    // .then(listCatchablePokemon(pokeStopPoint))
    .then(listCatchablePokemon(hotSpotPoint))
    // .then(listCatchablePokemon(entrancePoint))
    .then(() => {
        console.log('THE END');
    })
    .catch(shitBroke);
