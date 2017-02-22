module.exports.Point = class Point {
    constructor(lat, lng, name) {
        this._lat = Number(lat.toFixed(6));
        this._lng = Number(lng.toFixed(6));
        this.name = name;
    }

    get randomInc() {
        return (Math.floor(Math.random() * 201) - 100) / Math.pow(10, 6);
    }

    get lat() {
        return Number((this._lat + this.randomInc).toFixed(6));
    }

    get exactLat() {
        return this._lat;
    }

    get lng() {
        return Number((this._lng + this.randomInc).toFixed(6));
    }

    get exactLng() {
        return this._lng;
    }
}
