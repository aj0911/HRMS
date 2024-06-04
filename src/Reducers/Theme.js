import { createSlice } from "@reduxjs/toolkit"
import { COLORS, MODES } from "../Helper/Helper"


const initialState = {
    mode: MODES.LIGHT,
    colors: COLORS.LIGHT
}
export const Theme = createSlice({
    name: 'Theme',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.mode = MODES.DARK;
            state.colors = COLORS.DARK
        },
        togglelightMode: (state) => {
            state.mode = MODES.LIGHT;
            state.colors = COLORS.LIGHT;
        }
    }
})

export const { toggleDarkMode, togglelightMode } = Theme.actions;