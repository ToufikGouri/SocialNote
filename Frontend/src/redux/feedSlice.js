import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllPosts = createAsyncThunk(
    "feed/fetchAllPosts",
    async () => {
        return await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/feed`, { withCredentials: true })
            .then(res => res.data.data.reverse())
    }
)

export const getUserAllPosts = createAsyncThunk(
    "feed/fetchUserAllPosts",
    async () => {
        return await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/feed/userposts`, { withCredentials: true })
            .then(res => res.data.data.reverse())
    }
)

const initialState = {
    allPosts: [],
    userPosts: [],
    loading: false
}

export const feedSlice = createSlice({
    name: "feed",
    initialState,
    extraReducers: (builder) => {
        // allPosts case
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.allPosts = action.payload
                state.loading = false
            })
            .addCase(getAllPosts.rejected, (state) => {
                state.loading = false
            })

        // user posts case
        builder
            .addCase(getUserAllPosts.pending, (state) => {
                state.loading = true
            })
            .addCase(getUserAllPosts.fulfilled, (state, action) => {
                state.userPosts = action.payload
                state.loading = false
            })
            .addCase(getUserAllPosts.rejected, (state) => {
                state.loading = false
            })

    }
})

export default feedSlice.reducer