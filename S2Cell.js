const s2 = require('s2-geometry').S2;

class S2Cell {
    constructor(cell) {
        this.cell = cell;
    }

    get cellId() {
        return this.cell.s2_cell_id.toString();
    }

    get coord() {
        return s2.idToLatLng(this.cellId)
    }

    get lat() {
        return this.coord.lat;
    }

    get lng() {
        return this.coord.lng;
    }
}

module.exports.S2Cell = S2Cell;