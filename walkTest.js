const firebase = require('firebase');
const { getWayFinderLocations, getRecentWayFinderLocations, watchWayFinderLocations, saveWayFinderLocation, getPokemon, savePokemon } = require('./util/firebase');
const walker = require('./util/walk');
const { Point } = require('./classses/point');
const uuid = require('uuid/v1');

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

const addStep = (point) => {
    return saveWayFinderLocation(point);
}

const addMon = (point) => {
    return savePokemon(Math.ceil(Math.random() * 230), new Date().getTime() + 360000, point);
}

walker.onBegin((obj) => {
    console.log('BEGINNING\n', obj)
});
walker.onStep((obj) => {
    console.log('Stepping\n', obj);
    // addMon(obj.currentPt);
    addStep(obj.currentPt);
})
walker.onEnd((obj) => {
    console.log('ENDING\n', obj)
})
walker.walkPath([home, cornerPoint, creekPoint, pokeStopPoint, entrancePoint, secondHotSpotPoint, LakeCornerPoint, pokeStopPoint, hotSpotPoint, home], 15);
