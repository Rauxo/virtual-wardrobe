// src/pages/Donations.tsx
import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Mail, Clock, ArrowUpRight, ArrowDownLeft, Package, Send, History, X } from 'lucide-react';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
}

interface Donation {
  id: string;
  type: 'sent' | 'received';
  itemName: string;
  email: string;
  date: string;
}

const wardrobeItems: ClothingItem[] = [
  { id: "1", name: "Blue Denim Jacket", category: "Jacket", color: "Blue" },
  { id: "2", name: "White T-Shirt", category: "Top", color: "White" },
  { id: "3", name: "Black Jeans", category: "Bottom", color: "Black" },
  { id: "4", name: "Red Scarf", category: "Accessories", color: "Red" },
];

const initialHistory: Donation[] = [
  { id: "1", type: "sent", itemName: "Old Hoodie", email: "friend@gmail.com", date: "2025-04-12" },
  { id: "2", type: "received", itemName: "Green Sweater", email: "donor@mail.com", date: "2025-04-10" },
  { id: "3", type: "sent", itemName: "Sneakers", email: "sister@outlook.com", date: "2025-04-05" },
];

function Donations() {
  const [tab, setTab] = useState<'send' | 'received' | 'history'>('send');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [email, setEmail] = useState("");
  const [history, setHistory] = useState<Donation[]>(initialHistory);

  const openModal = (item: ClothingItem) => {
    setSelectedItem(item);
    setEmail("");
    setModalOpen(true);
  };

  const sendDonation = () => {
    if (!email.includes("@")) return alert("Enter valid email");
    const newEntry: Donation = {
      id: Date.now().toString(),
      type: "sent",
      itemName: selectedItem!.name,
      email,
      date: new Date().toISOString().split('T')[0],
    };
    setHistory([newEntry, ...history]);
    setModalOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 sm:py-10">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Donations</h1>

        {/* Mobile-Friendly Tabs (vertical on small screens) */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          {[
            { key: 'send', label: 'Send', icon: Send, bg: 'bg-purple-600' },
            { key: 'received', label: 'Received', icon: Package, bg: 'bg-emerald-600' },
            { key: 'history', label: 'History', icon: History, bg: 'bg-blue-600' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white transition ${
                tab === t.key ? t.bg : "bg-gray-300"
              }`}
            >
              <t.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area with Color */}
        <div className={`rounded-2xl p-6 sm:p-8 min-h-96 transition-all ${
          tab === 'send' ? 'bg-purple-50 border border-purple-200' :
          tab === 'received' ? 'bg-emerald-50 border border-emerald-200' :
          'bg-blue-50 border border-blue-200'
        }`}>

          {/* Send Tab */}
          {tab === 'send' && (
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-5">Send an Item</h2>
              <div className="space-y-4">
                {wardrobeItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.category} • {item.color}</p>
                    </div>
                    <button
                      onClick={() => openModal(item)}
                      className="text-purple-600 font-medium flex items-center gap-1"
                    >
                      Send <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Received Tab */}
          {tab === 'received' && (
            <div>
              <h2 className="text-xl font-semibold text-emerald-800 mb-5">Received Donations</h2>
              {history.filter(h => h.type === "received").length === 0 ? (
                <p className="text-center text-emerald-600 py-12">No items received yet</p>
              ) : (
                <div className="space-y-4">
                  {history.filter(h => h.type === "received").map(h => (
                    <div key={h.id} className="p-5 bg-white rounded-xl shadow-sm">
                      <p className="font-medium text-gray-900">{h.itemName}</p>
                      <p className="text-sm text-emerald-700">From: {h.email}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {h.date}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {tab === 'history' && (
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-5">Donation History</h2>
              <div className="space-y-4">
                {history.map(h => (
                  <div key={h.id} className={`p-5 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                    h.type === "sent" ? "bg-purple-100" : "bg-emerald-100"
                  }`}>
                    <div className="flex items-center gap-4">
                      {h.type === "sent" ? (
                        <ArrowUpRight className="w-6 h-6 text-purple-700" />
                      ) : (
                        <ArrowDownLeft className="w-6 h-6 text-emerald-700" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{h.itemName}</p>
                        <p className="text-sm text-gray-700">
                          {h.type === "sent" ? "Sent to" : "From"} {h.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile-Optimized Modal */}
        {modalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">Send Item</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-700 mb-5">
                Sending: <span className="font-bold text-purple-700">{selectedItem.name}</span>
              </p>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none mb-6 text-base"
              />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setModalOpen(false)} className="py-3 border border-gray-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button onClick={sendDonation} className="py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
                  Send
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