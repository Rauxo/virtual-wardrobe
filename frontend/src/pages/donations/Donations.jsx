// src/pages/Donations.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import {
  Mail, Clock, ArrowUpRight, ArrowDownLeft, Package, Send, History, X,
  User, CheckCircle, XCircle, Loader2
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
  const { items: wardrobeItems, loading: wardrobeLoading } = useSelector(state => state.wardrobe);
  const { donations, loading: donationsLoading } = useSelector(state => state.donation);

  const [tab, setTab] = useState('send');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSending, setIsSending] = useState(false);

  const activeWardrobeItems = wardrobeItems.filter(i => i.status !== 'donated');

  useEffect(() => {
    dispatch(getItems());
    dispatch(getDonations(tab === 'history' ? 'history' : tab));
  }, [dispatch, tab]);

  const openModal = (item) => {
    setSelectedItem(item);
    setRecipientEmail('');
    setNotes('');
    setModalOpen(true);
  };

  const handleSendDonation = async () => {
    if (!recipientEmail.includes('@')) return toast.error('Valid email required');
    if (!selectedItem) return toast.error('No item selected');
    if (recipientEmail === user?.email) return toast.error("Can't send to yourself");

    setIsSending(true);
    try {
      const result = await dispatch(sendDonation({ itemId: selectedItem._id, recipientEmail, notes }));
      if (sendDonation.fulfilled.match(result)) {
        toast.success('Donation sent!');
        setModalOpen(false);
        dispatch(getDonations('sent'));
      }
    } catch (err) {
      toast.error('Failed to send');
    } finally {
      setIsSending(false);
    }
  };

  const handleAccept = async (id) => {
    if (!window.confirm('Accept this donation?')) return;
    const result = await dispatch(acceptDonation(id));
    if (acceptDonation.fulfilled.match(result)) {
      toast.success('Donation accepted!');
      dispatch(getDonations('received'));
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this donation? Item will return to sender.')) return;
    try {
      const res = await fetch(`/api/donations/${id}/reject`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Donation rejected');
        dispatch(getDonations('received'));
      } else toast.error(data.message);
    } catch { toast.error('Failed'); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this donation?')) return;
    const result = await dispatch(cancelDonation(id));
    if (cancelDonation.fulfilled.match(result)) {
      toast.success('Cancelled');
      dispatch(getDonations('sent'));
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getStatusBadge = (status) => {
    const map = {
      pending: ['bg-yellow-100 text-yellow-800', 'Pending'],
      accepted: ['bg-blue-100 text-blue-800', 'Accepted'],
      completed: ['bg-emerald-100 text-emerald-800', 'Completed'],
      cancelled: ['bg-red-100 text-red-800', 'Cancelled'],
      rejected: ['bg-orange-100 text-orange-800', 'Rejected'],
    };
    const [color, label] = map[status] || ['bg-gray-100 text-gray-800', status];
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
  };

  const currentDonations = tab === 'send'
    ? donations?.filter(d => d.type === 'sent') || []
    : tab === 'received'
    ? donations?.filter(d => d.type === 'received') || []
    : donations || [];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Donations</h1>

        <div className="flex gap-4 mb-8">
          {['send', 'received', 'history'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-3 rounded-xl font-medium capitalize ${tab === t ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
              {t === 'send' ? 'Send' : t === 'received' ? 'Received' : 'History'}
            </button>
          ))}
        </div>

        {/* Send Tab */}
        {tab === 'send' && (
          <div>
            {activeWardrobeItems.length === 0 ? (
              <div className="text-center py-20">No items to donate</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeWardrobeItems.map(item => (
                  <div key={item._id} className="bg-white rounded-xl shadow p-4">
                    {item.imageUrl && <img src={`http://localhost:8080${item.imageUrl}`} alt="" className="w-full h-48 object-cover rounded" />}
                    <h3 className="font-bold mt-2">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category} • {item.color}</p>
                    <button onClick={() => openModal(item)} className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg">
                      Send Donation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Received & History Tabs */}
        {(tab === 'received' || tab === 'history') && (
          <div className="space-y-6">
            {currentDonations.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No donations yet</div>
            ) : (
              currentDonations.map(d => (
                <div key={d._id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{d.itemName}</h3>
                      <p className="text-sm text-gray-600">{d.itemCategory} • {d.itemColor}</p>
                      <p className="text-sm mt-2">
                        {d.type === 'sent' ? 'To: ' : 'From: '}
                        <span className="font-medium">
                          {d.type === 'sent' ? d.recipientEmail : d.donor?.email || 'Unknown'}
                        </span>
                      </p>
                      {d.notes && <p className="text-sm italic text-gray-600 mt-2">"{d.notes}"</p>}
                    </div>
                    <div className="text-right">
                      {getStatusBadge(d.status)}
                      <p className="text-xs text-gray-500 mt-2">{formatDate(d.createdAt)}</p>
                    </div>
                  </div>

                  {d.status === 'pending' && (
                    <div className="mt-4 flex gap-3 justify-end">
                      {d.type === 'received' ? (
                        <>
                          <button onClick={() => handleAccept(d._id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                            Accept
                          </button>
                          <button onClick={() => handleReject(d._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
                            Reject
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleCancel(d._id)} className="text-red-600 text-sm">
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Send Donation</h2>
              <input
                type="email"
                placeholder="Recipient email"
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl mb-4"
              />
              <textarea
                placeholder="Optional note..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border rounded-xl mb-6"
              />
              <div className="flex gap-3">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 border rounded-xl">Cancel</button>
                <button
                  onClick={handleSendDonation}
                  disabled={isSending || !recipientEmail.includes('@')}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Send'}
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