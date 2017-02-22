export default function user(state = { token: {}, position: [], loading: false, error: false, signOutLoading: false, signOutError: false }, action) {
    switch(action.type) {
        case 'USER_SIGN_IN_SUCCESS': {
            const token = action.token;
            const position = action.position;
            return {...state, token, position: [...state.position, position] };
        }
        case 'USER_SIGN_IN_LOADING': {
            return {...state, token: undefined, loading: true, error: true };
        }
        case 'USER_SIGN_IN_ERROR': {
            return {...state, token: undefined, loading: false, error: true };
        }
        case 'USER_SIGN_OUT_SUCCESS': {
            return {...state, token: undefined, position: [], signOutLoading: false, signOutError: false };
        }
        case 'USER_SIGN_OUT_LOADING': {
            return {...state, signOutLoading: true, signOutError: false };
        }
        case 'USER_SIGN_OUT_ERROR': {
            return {...state, signOutLoading: false, signOutError: true };
        }
    }

    return {...state};
}