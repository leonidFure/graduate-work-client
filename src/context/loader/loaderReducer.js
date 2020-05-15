import {HIDE_LOADER, SHOW_LOADER} from "../types";

const handlers = {
    [SHOW_LOADER]: (state) => ({...state, visible: true}),
    [HIDE_LOADER]: state => ({...state, visible: false}),
    DEFAULT: state => state,
};

export const loaderReducer = (state, action) => {
    const handle = handlers[action.type] || handlers.DEFAULT
    return handle(state, action)
};