import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from '../../Helpers/axiosInstance';

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    role: localStorage.getItem("role") || "",
    data: JSON.parse(localStorage.getItem("data")) || {},
    loading: false,
    error: null
};

// Helper function to save user data to localStorage
const saveUserData = (user) => {
    localStorage.setItem("data", JSON.stringify(user));
    localStorage.setItem("role", user.role);
    localStorage.setItem("isLoggedIn", true);
};

// Helper function to clear user data from localStorage
const clearUserData = () => {
    localStorage.removeItem("data");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
};

// .....signup.........
export const createAccount = createAsyncThunk("/auth/signup", async (data, { rejectWithValue }) => {
    const loadingMessage = toast.loading("Please wait! Creating your account...");
    try {
        const res = await axiosInstance.post("/user/register", data);
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        return rejectWithValue(error?.response?.data?.message);
    }
});

// .....Login.........
export const login = createAsyncThunk("/auth/login", async (data, { rejectWithValue }) => {
    const loadingMessage = toast.loading("Please wait! Logging into your account...");
    try {
        const res = await axiosInstance.post("/user/login", data);
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        return rejectWithValue(error?.response?.data?.message);
    }
});

// .....Logout.........
export const logout = createAsyncThunk("/auth/logout", async (_, { rejectWithValue }) => {
    const loadingMessage = toast.loading("Logging out...");
    try {
        const res = await axiosInstance.get("/user/logout");
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        return rejectWithValue(error?.response?.data?.message);
    }
});

// .....Get User Data.........
export const getUserData = createAsyncThunk("/auth/user/me", async (_, { rejectWithValue }) => {
    const loadingMessage = toast.loading("Fetching profile...");
    try {
        const res = await axiosInstance.get("/user/me");
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        return rejectWithValue(error?.response?.data?.message);
    }
});

// .....Update User Data.........
export const updateUserData = createAsyncThunk("/auth/user/me", async (data, { rejectWithValue }) => {
    const loadingMessage = toast.loading("Updating changes...");
    try {
        const res = await axiosInstance.post(`/user/update/${data.id}`, data.formData);
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        return rejectWithValue(error?.response?.data?.message);
    }
});

// .....Change Password.........
export const changePassword = createAsyncThunk("/auth/user/changePassword", async (userPassword, { rejectWithValue }) => {
    const loadingMessage = toast.loading("Changing password...");
    try {
        const res = await axiosInstance.post("/user/change-password", userPassword);
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        return rejectWithValue(error?.response?.data?.message);
    }
});

// .....Forget Password.........
export const forgetPassword = createAsyncThunk("auth/user/forgetPassword", async (email, { rejectWithValue }) => {
    const loadingMessage = toast.loading("Please wait! Sending email...");
    try {
        const res = await axiosInstance.post("/user/reset", { email });
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        return rejectWithValue(error?.response?.data?.message);
    }
});

// .....Reset Password.........
export const resetPassword = createAsyncThunk("/user/reset", async (data, { rejectWithValue }) => {
    const loadingMessage = toast.loading("Please wait! Resetting your password...");
    try {
        const res = await axiosInstance.post(`/user/reset/${data.resetToken}`, { password: data.password });
        toast.success(res?.data?.message, { id: loadingMessage });
        return res?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message, { id: loadingMessage });
        return rejectWithValue(error?.response?.data?.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Handle signup
        builder
            .addCase(createAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                saveUserData(action.payload.user);
                state.data = action.payload.user;
                state.role = action.payload.user.role;
                state.isLoggedIn = true;
                state.loading = false;
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle login
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                saveUserData(action.payload.user);
                state.data = action.payload.user;
                state.role = action.payload.user.role;
                state.isLoggedIn = true;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle logout
        builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                clearUserData();
                state.data = {};
                state.role = "";
                state.isLoggedIn = false;
                state.loading = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle get user data
        builder
            .addCase(getUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                saveUserData(action.payload.user);
                state.data = action.payload.user;
                state.role = action.payload.user.role;
                state.isLoggedIn = true;
                state.loading = false;
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default authSlice.reducer;
