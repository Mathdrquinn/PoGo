export default function inventory(state = {loading: false, error: false, data: []}, action) {
    switch(action.type) {
        case 'INVENTORY_LOADING': {
            return {...state, loading: true, error: false};
        }
        case 'INVENTORY_DATA': {
            return {...state, data: action.data, loading: false, error: false};
        }
        case 'INVENTORY_ERROR': {
            return {...state, loading: false, error: true};
        }
    }

    return {...state};
}