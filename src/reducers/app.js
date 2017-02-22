export default (state = { name: 'PoGo Stick' }, action) => {
    switch (action.type) {
        case 'UPDATE_TITLE': {
            return {...state, name: action.name };
        }
    }

    return {...state};
}