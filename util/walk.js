const { Point } = require('../classses/point');
const events = require('./events');

const startTime = new Date();
const distanceToWalk = (mPSec) => {
    const meterPLat = 111034;
    return Number((mPSec/meterPLat).toFixed(6));
}
const convertToRadians = (x) => x * Math.PI / 180;
const calcDistance = (aLat, bLat, latDelta, lngDelta) => {
    const r = 6371e3; // Earth radius in meters;
    const w = Math.sin(latDelta/2) * Math.sin(latDelta/2) +
        Math.cos(aLat) * Math.cos(bLat) *
        Math.sin(lngDelta/2) * Math.sin(lngDelta/2);
    const c = 2 * Math.atan2(Math.sqrt(w), Math.sqrt(1-w));

    return r * c;
}
const distance = (a, b) => {
    const aLat = convertToRadians(a.exactLat);
    const bLat = convertToRadians(b.exactLat);
    const latDelta = aLat-bLat;
    const lngDelta = convertToRadians(a.exactLng-b.exactLng);

    return calcDistance(aLat, bLat, latDelta, lngDelta);
}
const xDistance = (a, b) => {
    const aLat = convertToRadians(a.exactLat);
    const bLat = convertToRadians(b.exactLat);
    const latDelta = aLat-bLat;
    const lngDelta = convertToRadians(a.exactLng-b.exactLng);

    return calcDistance(aLat, bLat, latDelta, 0);
}
const yDistance = (a, b) => {
    const aLat = convertToRadians(a.exactLat);
    const lngDelta = convertToRadians(a.exactLng-b.exactLng);

    return calcDistance(aLat, aLat, 0, lngDelta);
}

const WALK_EVENTS = {
    BEGIN: 'BEGIN',
    STEP: 'STEP',
    END: 'END',
};

function walk(a, b, speed = 3) {
    let velocity = speed;
    let currentPt = a;
    let startPt = a;
    let endPt = b;

    if (!(typeof speed === 'number' && 0 < speed && speed <= 25)) {
        throw new Error('The speed argument is invalid.  Speed is a number between 0 and 15');
    }

    if (!(a instanceof Point && b instanceof Point)) {
        throw new Error('The arguments are not instances of the Point class.')
    }

    const walkX = (fromPt, toPT, speed) => {
        const p = new Promise((resolve) => {

            const interimDistance = xDistance(fromPt, toPT);
            const direction = (toPT.exactLat - fromPt.exactLat) > 0 ? 1 : -1;

            if (interimDistance < speed) {
                resolve(fromPt);
            } else {
                const change = direction * distanceToWalk(speed);
                currentPt = new Point(fromPt.exactLat + change, fromPt.exactLng);

                events.publish(WALK_EVENTS.STEP, {
                    startPt,
                    currentPt,
                    endPt,
                    totalDistance: distance(startPt, endPt),
                    remainingDistance: distance(currentPt, endPt),
                    speed,
                });

                setTimeout(() => resolve(walkX(currentPt, toPT, speed)), 500);
            }
        });

        return p;
    }
    const walkY = (fromPt, toPT, speed) => {
        const p = new Promise((resolve) => {

            const interimDistance = yDistance(fromPt, toPT);
            const direction = (toPT.exactLng - fromPt.exactLng) > 0 ? 1 : -1;

            if (interimDistance < speed) {
                resolve(fromPt);
            } else {
                const change = direction * distanceToWalk(speed);

                currentPt = new Point(fromPt.exactLat, fromPt.exactLng + change);

                events.publish(WALK_EVENTS.STEP, {
                    startPt,
                    currentPt,
                    endPt,
                    totalDistance: distance(startPt, endPt),
                    remainingDistance: distance(currentPt, endPt),
                    speed,
                });

                setTimeout(() => resolve(walkY(currentPt, toPT, speed)), 1000);
            }
        });

        return p;
    }

    events.publish(WALK_EVENTS.BEGIN, {
        startPt,
        currentPt,
        endPt,
        totalDistance: distance(startPt, endPt),
        remainingDistance: distance(currentPt, endPt),
        speed,
    });

    return walkX(startPt, endPt, speed)
        .then((newPt) => currentPt = newPt)
        .then(() => walkY(currentPt, endPt, speed))
        .then((finalPt) => {
            currentPt = finalPt;
            events.publish(WALK_EVENTS.END, {
                startPt,
                currentPt,
                endPt,
                totalDistance: distance(startPt, endPt),
                remainingDistance: distance(currentPt, endPt),
                speed,
            });
            return finalPt;
        })
        .catch((err) => {
            console.log('something bad happened', err);
        });
}

const walkPath = (points, speed) => {

    if (!Array.isArray(points) || points.length < 2) {
        throw new Error('WalkPath takes an array of two or more points')
    }

    if (points.some(pt => !(pt instanceof Point))) {
        throw new Error('The array passed contained elements that are not an a Point instance');
    }

    const pts = points.slice();

    const recursiveWalk = (a, b, s) => {
        return walk(a, b, s)
            .then((lastPt) => {
                if (!pts.length) {
                    console.log('$$$$$$ THE END $$$$$$');
                    return lastPt;
                }

                return recursiveWalk(b, pts.shift(), s);
            })
    }

    return recursiveWalk(pts.shift(), pts.shift(), speed)
}

const walkLoop = (points, speed, opts = { count: 0 }) => {

    if (!Array.isArray(points) || points.length < 2) {
        throw new Error('WalkLoop takes an array of two or more points')
    }

    if (points.some(pt => !(pt instanceof Point))) {
        throw new Error('The array passed contained elements that are not an a Point instance');
    }

    const startingPt = points.slice(0, 1);
    const pts = points.concat(points.slice(0, 1));

    const recursiveLoop = (points, speed) => {
        return walkPath(points, speed)
            .then((startOfNewLoopPt) => {
                console.log('@@@@@ A LOOP HAS BEEN COMPLETED @@@@@');
                if (opts.count === 0) {
                    console.log('@@@@@ The end of looping @@@@@');
                    return startOfNewLoopPt;
                }

                const patchedLoop = [startOfNewLoopPt].concat(points.slice(1));
                return recursiveLoop(patchedLoop, speed, Object.assign(opts, { count: opts.count - 1 }));
            })
    }

    return recursiveLoop(pts, speed, opts);
}

const walker = {
    walk,
    walkPath,
    walkLoop,
    distance,
    onBegin(cb) {
        events.subscribe(WALK_EVENTS.BEGIN, cb);
    },
    onStep(cb) {
        events.subscribe(WALK_EVENTS.STEP, cb);
    },
    onEnd(cb) {
        events.subscribe(WALK_EVENTS.END, cb);
    }
};

// const home = new Point(39.910631, -86.051998, 'home');
// const cornerPoint = new Point(39.910626, -86.052767, 'corner');
// const triplePoint = new Point(39.909579, -86.052864, 'triple');
// const pokeStopPoint = new Point(39.908531, -86.051480, 'pokeStop');
// walker.onBegin((obj) => {
//     console.log('BEGINNING\n', obj)
// });
// walker.onStep((obj) => {
//     console.log('Stepping\n', obj)
// })
// walker.onEnd((obj) => {
//     console.log('ENDING\n', obj)
// })
// // walker.walk(home, pokeStopPoint, 4);
// walker.walkLoop([home, triplePoint, pokeStopPoint], 23, { count: 3 });

module.exports = walker;