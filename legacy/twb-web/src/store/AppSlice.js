import { createSlice } from '@reduxjs/toolkit';
import * as authService from '@services/AuthService';

const appSlice = createSlice({
    name: 'app',
    initialState: {
        apiURL: 'http://localhost:3001/api',
        serverPath: 'http://localhost:3001/',
        isLoggedIn: null,
        profile: {},
        categories: [],
        notifications: [],
        isLoading: true,
    },
    reducers: {
        toggleLoading(state, action) {
            state.isLoading = action.payload;
        },
        pushCategoriesToState: (state, action) => {
            if (state.categories.length < 1) {
                state.categories.push(...action.payload);
            }
        },
        pushNotificationsToState: (state, action) => {
            if (state.notifications.length < 1) {
                state.notifications.push(...action.payload);
            }
        },
        authenticate: (state, action) => {
            state.isLoggedIn = authService.isLoggedIn();
            state.profile = action.payload;
        },
        updateProfileFaqs: (state, action) => {
            state.profile.vendor.faqs = action.payload;
        },
        changeWeddingCardPhoto: (state, action) => {
            state.profile.couple.weddingDetail.cardPhoto = action.payload.cardPhoto;
            console.log(action.payload, state.profile.couple.weddingDetail.cardPhoto);
        }
    },
});

export const { toggleLoading, pushCategoriesToState, pushNotificationsToState, authenticate, updateProfileFaqs, userVerified, changeWeddingCardPhoto } = appSlice.actions;
export default appSlice.reducer;