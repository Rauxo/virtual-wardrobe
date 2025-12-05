import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getNotifications = createAsyncThunk(
  'notification/getNotifications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await api.get('/notification/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id, { getState }) => {
    const token = getState().auth.token;
    await api.put(`/notification/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return id;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { getState }) => {
    const token = getState().auth.token;
    await api.put('/notification/notifications/read-all', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return null;
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notification/clearAll',
  async (_, { getState }) => {
    const token = getState().auth.token;
    await api.delete('/notification/notifications/clear', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return null;
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    list: [],
    unreadCount: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(getNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notif = state.list.find(n => n._id === action.payload);
        if (notif) notif.read = true;
        state.unreadCount = state.list.filter(n => !n.read).length;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.list.forEach(n => n.read = true);
        state.unreadCount = 0;
      })
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.list = [];
        state.unreadCount = 0;
      });
  }
});

export default notificationSlice.reducer;