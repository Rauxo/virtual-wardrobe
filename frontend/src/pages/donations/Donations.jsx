// src/pages/Donations.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import {
  Mail,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  Send,
  History,
  X,
  User,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getItems } from '../../store/slices/wardrobeSlice';
import {
  sendDonation,
  getDonations,
  cancelDonation,
  acceptDonation,
} from '../../store/slices/donationSlice';

function Donations() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items: wardrobeItems, loading: wardrobeLoading } = useSelector(
    (state) => state.wardrobe
  );
  const { donations, stats, loading: donationsLoading } = useSelector(
    (state) => state.donation
  );

  const [tab, setTab] = useState('send'); // 'send' | 'received' | 'history'
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [activeDonations, setActiveDonations] = useState({
    sent: [],
    received: [],
    all: [],
  });

  // Only show items that are not already donated
 const activeWardrobeItems = wardrobeItems.filter(
  (item) => ['active', 'inactive'].includes(item.status)
);

  useEffect(() => {
    dispatch(getItems({ status: 'active' }));

    if (tab === 'send') {
      dispatch(getDonations('sent'));
    } else if (tab === 'received') {
      dispatch(getDonations('received'));
    } else {
      dispatch(getDonations('history'));
    }
  }, [dispatch, tab]);

  useEffect(() => {
    if (donations) {
      const sent = donations.filter((d) => d.type === 'sent');
      const received = donations.filter((d) => d.type === 'received');
      setActiveDonations({ sent, received, all: donations });
    }
  }, [donations]);

  const openModal = (item) => {
    setSelectedItem(item);
    setRecipientEmail('');
    setNotes('');
    setModalOpen(true);
  };

  const handleSendDonation = async () => {
    if (!recipientEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!selectedItem) {
      toast.error('No item selected');
      return;
    }
    if (recipientEmail === user?.email) {
      toast.error('Cannot donate to yourself');
      return;
    }

    setIsSending(true);

    try {
      const result = await dispatch(
        sendDonation({
          itemId: selectedItem._id,
          recipientEmail,
          notes,
        })
      );

      if (sendDonation.fulfilled.match(result)) {
        toast.success('Donation sent successfully!');
        setModalOpen(false);
        setRecipientEmail('');
        setNotes('');
        setSelectedItem(null);
        dispatch(getDonations(tab === 'history' ? 'history' : tab));
      } else {
        throw new Error(result.payload || 'Failed to send donation');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send donation');
    } finally {
      setIsSending(false);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      const result = await dispatch(acceptDonation(donationId));
      if (acceptDonation.fulfilled.match(result)) {
        toast.success('Donation accepted successfully!');
        dispatch(getDonations('received'));
      }
    } catch {
      toast.error('Failed to accept donation');
    }
  };

  const handleCancelDonation = async (donationId) => {
    if (!window.confirm('Are you sure you want to cancel this donation?')) return;

    try {
      const result = await dispatch(cancelDonation(donationId));
      if (cancelDonation.fulfilled.match(result)) {
        toast.success('Donation cancelled successfully!');
        dispatch(getDonations('sent'));
      }
    } catch {
      toast.error('Failed to cancel donation');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      accepted: { color: 'bg-blue-100 text-blue-800', label: 'Accepted' },
      completed: { color: 'bg-emerald-100 text-emerald-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };

    const { color, label } = config[status] || {
      color: 'bg-gray-100 text-gray-800',
      label: status,
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  if (donationsLoading && tab !== 'send') {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
            Donations
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Sent: {stats?.sent || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Received: {stats?.received || 0}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'send', label: 'Send', icon: Send, bg: 'bg-purple-600', count: stats?.sent || 0 },
            { key: 'received', label: 'Received', icon: Package, bg: 'bg-emerald-600', count: stats?.received || 0 },
            {
              key: 'history',
              label: 'History',
              icon: History,
              bg: 'bg-blue-600',
              count: (stats?.sent || 0) + (stats?.received || 0),
            },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white transition-all ${
                tab === t.key ? `${t.bg} shadow-lg` : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              <t.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{t.label}</span>
              {t.count > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div
          className={`rounded-2xl p-6 sm:p-8 min-h-96 transition-all border ${
            tab === 'send'
              ? 'bg-purple-50 border-purple-200'
              : tab === 'received'
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          {/* Send Tab */}
          {tab === 'send' && (
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-5">
                Send an Item
              </h2>

              {wardrobeLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
              ) : activeWardrobeItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No items available to donate</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add some items to your wardrobe first
                  </p>
                  <button
                    onClick={() => navigate('/myclothes')}
                    className="mt-4 text-purple-600 font-medium hover:text-purple-700"
                  >
                    Go to Wardrobe →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeWardrobeItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          {item.imageUrl ? (
                            <img
                              src={`http://localhost:8080${item.imageUrl}`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.category} • {item.color}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Added {formatDate(item.addedDate)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openModal(item)}
                        disabled={item.status === 'donated'}
                        className="text-purple-600 font-medium flex items-center gap-1 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send <ArrowUpRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Received Tab */}
          {tab === 'received' && (
            <div>
              <h2 className="text-xl font-semibold text-emerald-800 mb-5">
                Received Donations
              </h2>
              {activeDonations.received.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-emerald-600" />
                  </div>
                  <p className="text-emerald-600 font-medium">No items received yet</p>
                  <p className="text-sm text-emerald-500 mt-1">
                    Items donated to you will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeDonations.received.map((donation) => (
                    <div
                      key={donation._id}
                      className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-900">{donation.itemName}</p>
                          <p className="text-sm text-emerald-700 flex items-center gap-2 mt-1">
                            <User className="w-4 h-4" />
                            From: {donation.donor?.email || donation.donor?.name || 'Unknown donor'}
                          </p>
                        </div>
                        {getStatusBadge(donation.status)}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(donation.createdAt)}
                        </p>

                        {donation.status === 'pending' && (
                          <button
                            onClick={() => handleAcceptDonation(donation._id)}
                            className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {tab === 'history' && (
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-5">
                Donation History
              </h2>
              {activeDonations.all.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No donation history yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Start donating or receiving items to see history
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeDonations.all.map((donation) => (
                    <div
                      key={donation._id}
                      className={`p-5 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                        donation.type === 'sent' ? 'bg-purple-50' : 'bg-emerald-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {donation.type === 'sent' ? (
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <ArrowUpRight className="w-6 h-6 text-purple-700" />
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-100 rounded-lg">
                            <ArrowDownLeft className="w-6 h-6 text-emerald-700" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900">{donation.itemName}</p>
                            {getStatusBadge(donation.status)}
                          </div>
                          <p className="text-sm text-gray-700">
                            {donation.type === 'sent' ? 'Sent to' : 'From'}{' '}
                            <span className="font-medium">
                              {donation.type === 'sent'
                                ? donation.recipientEmail
                                : donation.donor?.email || donation.donor?.name || 'Unknown'}
                            </span>
                          </p>
                          {donation.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              "{donation.notes}"
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(donation.createdAt)}
                          </p>
                        </div>
                      </div>

                      {donation.type === 'sent' && donation.status === 'pending' && (
                        <button
                          onClick={() => handleCancelDonation(donation._id)}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Send Donation Modal */}
        {modalOpen && selectedItem && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">Send Donation</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  disabled={isSending}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow">
                    {selectedItem.imageUrl ? (
                      <img
                        src={`http://localhost:8080${selectedItem.imageUrl}`}
                        alt={selectedItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="w-8 h-8 text-purple-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedItem.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedItem.category} • {selectedItem.color}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="friend@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                      disabled={isSending}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Optional Message
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add a personal message..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition resize-none"
                      disabled={isSending}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  disabled={isSending}
                  className="py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendDonation}
                  disabled={isSending || !recipientEmail.includes('@')}
                  className="py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Donation'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Donations;