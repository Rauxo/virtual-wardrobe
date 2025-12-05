import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const addItem = createAsyncThunk(
  'wardrobe/addItem',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post('/wardrobe/items', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
  }
);

export const getItems = createAsyncThunk(
  'wardrobe/getItems',
  async (filters, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/wardrobe/items?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch items');
    }
  }
);

export const getDashboardStats = createAsyncThunk(
  'wardrobe/getDashboardStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get('/wardrobe/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'wardrobe/deleteItem',
  async (itemId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.delete(`/wardrobe/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { itemId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete item');
    }
  }
);

export const updateItemStatus = createAsyncThunk(
  'wardrobe/updateItemStatus',
  async ({ itemId, status }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.patch(
        `/wardrobe/items/${itemId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const wardrobeSlice = createSlice({
  name: 'wardrobe',
  initialState: {
    items: [],
    stats: {
      totalItems: 0,
      activeItems: 0,
      inactiveItems: 0,
      pendingDonations: 0,
      activeRate: 0,
    },
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearWardrobeError: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.stats = action.payload.stats;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload.item, ...state.items];
        state.message = action.payload.message;
        state.stats.totalItems += 1;
        state.stats.activeItems += 1;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload.itemId);
        state.message = action.payload.message;
        state.stats.totalItems -= 1;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateItemStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItemStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload.item;
        state.items = state.items.map(item =>
          item._id === updatedItem._id ? updatedItem : item
        );
        state.message = action.payload.message;
      })
      .addCase(updateItemStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWardrobeError } = wardrobeSlice.actions;
export default wardrobeSlice.reducer;