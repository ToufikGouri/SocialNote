import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserData = createAsyncThunk(
    "user/fetchUserData",
    async () => {
        const response = await axios.get("/api/v1/users")
        return response.data.data
    }
)

export const getUserNotes = createAsyncThunk(
    "user/fetchUserNotes",
    async () => {
        const response = await axios.get("/api/v1/notes")
        return response.data.data
    }
)

const initialState = {
    userData: null,
    userNotes: [],
    isLoggedIn: false,
    loading: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserLog: (state, action) => {
            state.isLoggedIn = action.payload
        },
        setUserData: (state, action) => {
            state.userData = action.payload
        }
    },
    extraReducers: (builder) => {
        // userData cases
        builder
            .addCase(getUserData.pending, (state) => {
                state.loading = true
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.userData = action.payload
                state.isLoggedIn = true
                state.loading = false
            })
            .addCase(getUserData.rejected, (state) => {
                state.userData = null
                state.loading = false
            })

        // userNotes cases
        builder
            .addCase(getUserNotes.pending, (state) => {
                state.loading = true
            })
            .addCase(getUserNotes.fulfilled, (state, action) => {
                state.userNotes = action.payload
                state.loading = false
            })
            .addCase(getUserNotes.rejected, (state) => {
                state.userNotes = []
                state.loading = false
            })


    }
})

export const { setUserLog, setUserData } = userSlice.actions

export default userSlice.reducer