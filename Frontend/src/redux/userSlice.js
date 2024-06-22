import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserData = createAsyncThunk(
    "user/fetchUserData",
    async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users`, { withCredentials: true })
        return response.data.data
    }
)

export const getUserNotes = createAsyncThunk(
    "user/fetchUserNotes",
    async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/notes`, { withCredentials: true })
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
        },
        sortNotesBy: (state, action) => {
            const urgencyMap = {
                "High": 1,
                "Mid": 2,
                "Low": 3,
            }
            if (action.payload === "Urgency") {
                state.userNotes = state.userNotes.toSorted((a, b) => urgencyMap[a.urgency] - urgencyMap[b.urgency])
            } else if (action.payload === "Favorite") {
                state.userNotes = state.userNotes.toSorted((a, b) => b.favorite - a.favorite)
            } else if(action.payload === "Clear"){
                state.userNotes = []
            }
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

export const { setUserLog, setUserData, sortNotesBy } = userSlice.actions

export default userSlice.reducer