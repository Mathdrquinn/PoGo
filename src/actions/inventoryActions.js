import axios from 'axios';

function setInventoryLoading() {
    return {
        type: 'INVENTORY_LOADING',
    };
}

function setInventoryData(data) {
    return {
        type: 'INVENTORY_DATA',
        data,
    };
}

function setInventoryError() {
    return {
        type: 'INVENTORY_ERROR',
    };
}

export function fetchInventoryData() {
    return function inventoryDataThunk(dispatch) {
        dispatch(setInventoryLoading());
        return axios.get('https://www.reddit.com/r/museum.json')
            .then(response => {
                const data = response.data.data.children;
                dispatch(setInventoryData(data));
            })
            .catch(() => dispatch(setInventoryError()));
    }
}