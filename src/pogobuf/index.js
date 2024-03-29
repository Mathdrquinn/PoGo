/*
 This example script shows how to work with the getInventory() API call and the
 splitInventory() function.
 */
const pogobuf = require('pogobuf');
const POGOProtos = require('node-pogo-protos');

// Note: To avoid getting softbanned, change these coordinates to something close to where you
// last used your account
const home = {
    lat: 39.910357,
    lng: -86.052457,
};

let client;

export const pogoStick = {
    GoogleLogin: pogobuf.GoogleLogin(),
};

// Login to Google and get a login token
new pogobuf.GoogleLogin().login('your-username@gmail.com', 'your-google-password')
    .then(token => {
        // Initialize the client
        client = new pogobuf.Client({
            authType: 'google',
            authToken: token
        });
        client.setPosition(home.lat, home.lng);

        // Uncomment the following if you want to see request/response information on the console
        // client.on('request', console.dir);
        // client.on('response', console.dir);

        // Perform the initial request
        return client.init();
    })
    .then(() => {
        // Get full inventory
        return client.getInventory(0);
    })
    .then(inventory => {
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
    .catch(console.error);