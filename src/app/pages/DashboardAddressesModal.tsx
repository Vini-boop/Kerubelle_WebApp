import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { toast } from 'sonner';
import { MapPin, Info } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  area: string; // Eldoret area
  streetAddress: string; // Specific location
  landmark?: string; // Optional landmark
  phone?: string;
  is_default?: boolean;
}

const API_BASE_URL = 'http://localhost:3000/api';

// Eldoret Areas
const ELDORET_AREAS = [
  'Select Area',
  'Huduma Centre',
  'Town Centre',
  'Kambi Sam',
  'Huruma',
  'Kapsoya',
  'Moi University',
  'Chepkoilel',
  'Stadium',
  'Maili Nne',
  'Kapsabet Road',
  'Uganda Road',
  'Jamhuri Park',
  'Central Market',
  'Railways',
  'Pioneer',
  'Eldoret West',
  'Langas',
  'Pipeline',
  'Kiminini',
  'Other (Outside Eldoret)'
];

export default function DashboardAddressesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState<Address | null>(null);
  const [label, setLabel] = useState('');
  const [area, setArea] = useState('Select Area');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch addresses on modal open
  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/addresses`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          setAddresses(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
        toast.error('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  const startAdd = () => {
    setEditing(null);
    setLabel('');
    setArea('Select Area');
    setStreetAddress('');
    setLandmark('');
    setPhone('');
  };

  const startEdit = (a: Address) => {
    setEditing(a);
    setLabel(a.label);
    setArea(a.area);
    setStreetAddress(a.streetAddress);
    setLandmark(a.landmark || '');
    setPhone(a.phone || '');
  };

  const save = async () => {
    if (!label || !area || area === 'Select Area' || !streetAddress) {
      toast.error('Label, area and specific location are required');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const isDefault = addresses.length === 0 || (!editing && addresses.some(a => a.is_default));
      
      if (editing) {
        const res = await fetch(`${API_BASE_URL}/addresses/${editing.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ label, area, streetAddress, landmark, phone, isDefault: editing.is_default }),
        });
        if (res.ok) {
          const updated = await res.json();
          setAddresses(prev => prev.map(a => a.id === editing.id ? updated : a));
          toast.success('Address updated');
          setEditing(null);
        } else {
          toast.error('Failed to update address');
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ label, area, streetAddress, landmark, phone, isDefault }),
        });
        if (res.ok) {
          const newA = await res.json();
          setAddresses(prev => [newA, ...prev]);
          toast.success('Address added');
        } else {
          toast.error('Failed to add address');
        }
      }
      setLabel('');
      setArea('Select Area');
      setStreetAddress('');
      setLandmark('');
      setPhone('');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setAddresses(prev => prev.filter(a => a.id !== id));
        toast.success('Address deleted');
      } else {
        toast.error('Failed to delete address');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete');
    }
  };

  const setDefault = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })));
        toast.success('Default address set');
      }
    } catch (err) {
      console.error('Set default error:', err);
      toast.error('Failed to set default');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F8C8DC]" />
            Manage Addresses
          </h3>
          <div className="flex gap-2">
            <button onClick={startAdd} className="px-3 py-1 rounded bg-gray-100">New</button>
            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100">Close</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600">Label *</label>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Home, Office" className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254..." className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Area *</label>
            <select value={area} onChange={e => setArea(e.target.value)} className="mt-1 w-full border rounded px-3 py-2 bg-white">
              {ELDORET_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            {area !== 'Select Area' && area !== 'Other (Outside Eldoret)' && (
              <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                <Info className="w-3 h-3" /> Free delivery in this area
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600">Specific Location / Street *</label>
            <input value={streetAddress} onChange={e => setStreetAddress(e.target.value)} placeholder="House No., Road, Shop Name" className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600">Nearby Landmark <span className="text-gray-400">(Optional)</span></label>
            <input value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="e.g., Near Huduma Centre, Opposite Total Station" className="mt-1 w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mb-4">
          <button onClick={() => { setLabel(''); setArea('Select Area'); setStreetAddress(''); setLandmark(''); setPhone(''); setEditing(null); }} className="px-4 py-2 rounded bg-gray-100">Reset</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white">{saving ? 'Saving...' : 'Save'}</button>
        </div>

        <div>
          {loading ? (
            <div className="text-center py-8"><div className="animate-spin w-6 h-6 border-2 border-[#F8C8DC] border-t-transparent rounded-full mx-auto"></div></div>
          ) : addresses.length === 0 ? (
            <p className="text-sm text-gray-500">No saved addresses</p>
          ) : (
            <div className="space-y-3">
              {addresses.map(a => (
                <div key={a.id} className="p-3 border rounded flex items-start justify-between">
                    <div>
                      <strong>{a.label}</strong>
                      {a.is_default && <span className="text-xs px-2 py-1 rounded bg-[#F8C8DC]/20 text-[#F8C8DC] ml-2">Default</span>}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">{a.area}</span><br/>
                      {a.streetAddress}
                      {a.landmark && <><br/><span className="text-gray-500">Near {a.landmark}</span></>}
                    </div>
                    {a.phone && <div className="text-xs text-gray-500">📞 {a.phone}</div>}
                  <div className="flex flex-col gap-2">
                    <button onClick={() => startEdit(a)} className="px-3 py-1 text-sm rounded bg-gray-100">Edit</button>
                    <button onClick={() => remove(a.id)} className="px-3 py-1 text-sm rounded bg-red-50 text-red-500">Delete</button>
                    {!a.is_default && <button onClick={() => setDefault(a.id)} className="px-3 py-1 text-sm rounded bg-gray-100">Set default</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
