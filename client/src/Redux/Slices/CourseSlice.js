import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../../Helpers/axiosInstance";

const initialState = {
    coursesData: [],
    loading: false,
    error: null
};

// Helper function to show toast notifications
const showToast = (message, type, id = null) => {
    if (type === "loading") return toast.loading(message, { id });
    if (type === "success") return toast.success(message, { id });
    if (type === "error") return toast.error(message, { id });
};

// ....get all courses....
export const getAllCourses = createAsyncThunk("/courses/get", async (_, { rejectWithValue }) => {
    const loadingMessage = showToast("Fetching courses...", "loading");
    try {
        const res = await axiosInstance.get("/courses");
        showToast(res?.data?.message, "success", loadingMessage);
        return res?.data;
    } catch (error) {
        showToast(error?.response?.data?.message || "Failed to fetch courses", "error", loadingMessage);
        return rejectWithValue(error?.response?.data?.message);
    }
});

// ....create course....
export const createNewCourse = createAsyncThunk("/courses/create", async (data, { rejectWithValue }) => {
    const loadingMessage = showToast("Creating course...", "loading");
    try {
        const res = await axiosInstance.post("/courses", data);
        showToast(res?.data?.message, "success", loadingMessage);
        return res?.data;
    } catch (error) {
        showToast(error?.response?.data?.message || "Failed to create course", "error", loadingMessage);
        return rejectWithValue(error?.response?.data?.message);
    }
});

// ....delete course......
export const deleteCourse = createAsyncThunk("/course/delete", async (id, { rejectWithValue }) => {
    const loadingMessage = showToast("Deleting course...", "loading");
    try {
        const res = await axiosInstance.delete(`/courses/${id}`);
        showToast("Course deleted successfully", "success", loadingMessage);
        return { id };
    } catch (error) {
        showToast(error?.response?.data?.message || "Failed to delete course", "error", loadingMessage);
        return rejectWithValue(error?.response?.data?.message);
    }
});

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle get all courses
            .addCase(getAllCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCourses.fulfilled, (state, action) => {
                state.coursesData = action.payload.courses;
                state.loading = false;
            })
            .addCase(getAllCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle create new course
            .addCase(createNewCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewCourse.fulfilled, (state, action) => {
                state.coursesData.push(action.payload.course);
                state.loading = false;
            })
            .addCase(createNewCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle delete course
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.coursesData = state.coursesData.filter(course => course.id !== action.payload.id);
                state.loading = false;
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default courseSlice.reducer;
