import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const sendDonation = createAsyncThunk(
  'donation/sendDonation',
  async ({ itemId, recipientEmail, notes }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.post(
        '/donations/send',
        { itemId, recipientEmail, notes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send donation');
    }
  }
);

export const acceptDonation = createAsyncThunk(
  'donation/acceptDonation',
  async (donationId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.put(
        `/donations/${donationId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept donation');
    }
  }
);

export const cancelDonation = createAsyncThunk(
  'donation/cancelDonation',
  async (donationId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.put(
        `/donations/${donationId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel donation');
    }
  }
);

export const getDonations = createAsyncThunk(
  'donation/getDonations',
  async (type, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/donations?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch donations');
    }
  }
);

export const getPendingDonations = createAsyncThunk(
  'donation/getPendingDonations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get('/donations/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending donations');
    }
  }
);

const donationSlice = createSlice({
  name: 'donation',
  initialState: {
    donations: [],
    sentDonations: [],
    receivedDonations: [],
    pendingDonations: [],
    stats: {
      sent: 0,
      received: 0,
      pending: 0,
    },
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearDonationError: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload.donations;
        state.stats = action.payload.stats;
      })
      .addCase(getDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = [action.payload.donation, ...state.donations];
        state.message = action.payload.message;
        state.stats.sent += 1;
        state.stats.pending += 1;
      })
      .addCase(sendDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptDonation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.donations.findIndex((d) => d._id === action.payload.donation._id);
        if (index !== -1) {
          state.donations[index] = action.payload.donation;
        }
        state.message = action.payload.message;
      })
      .addCase(acceptDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelDonation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.donations.findIndex((d) => d._id === action.payload.donation._id);
        if (index !== -1) {
          state.donations[index] = action.payload.donation;
        }
        state.message = action.payload.message;
      })
      .addCase(cancelDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPendingDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingDonations = action.payload.donations;
      })
      .addCase(getPendingDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDonationError } = donationSlice.actions;
export default donationSlice.reducer;