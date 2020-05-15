import React, {useReducer} from "react"
import {HIDE_LOADER, SHOW_LOADER} from "../types"
import {LoaderContext} from "../loader/loaderContext"
import {loaderReducer} from "./loaderReducer"

export const LoaderState = ({children}) => {
    const [state, dispatch] = useReducer(loaderReducer, {visible: false})
    const show = () => dispatch({type: SHOW_LOADER})
    const hide = () => dispatch({type: HIDE_LOADER})

    return (
        <LoaderContext.Provider
            value={{show, hide, loader: state}}
        >
            {children}
        </LoaderContext.Provider>
    );
}