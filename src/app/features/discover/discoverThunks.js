import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export const fetchDiscoverFeed = createAsyncThunk(
  "discover/fetchDiscoverFeed",
  async (limit = 6, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/discover", {
        params: { limit },
      });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
