import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react';

export default function DashboardProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  
  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  React.useEffect(() => {
    if (open) {
      setName(user?.name || '');
      setPhone(user?.phone || '');
      // Reset password fields when modal opens
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false
      });
    }
  }, [open, user]);

  // Update password requirements as user types
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);
    setPasswordRequirements({
      length: newPasswordValue.length >= 8,
      uppercase: /[A-Z]/.test(newPasswordValue),
      lowercase: /[a-z]/.test(newPasswordValue),
      number: /[0-9]/.test(newPasswordValue)
    });
  };

  const handleSave = async () => {
    if (!updateProfile) return;
    setSaving(true);
    const res = await updateProfile(name, phone);
    setSaving(false);
    if (res.success) {
      onClose();
      alert('Profile updated successfully!');
    } else {
      alert(res.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (!changePassword) return;
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
    if (!allRequirementsMet) {
      alert('Password does not meet all requirements');
      return;
    }

    setPasswordChanging(true);
    const res = await changePassword(currentPassword, newPassword);
    setPasswordChanging(false);
    
    if (res.success) {
      alert('Password changed successfully!');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert(res.message || 'Failed to change password');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Edit Profile</h3>
        
        {!showChangePassword ? (
          <>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]" 
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                <input 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]" 
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white rounded-lg hover:opacity-90 transition-all font-medium"
              >
                <Lock className="w-5 h-5" />
                Change Password
              </button>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <button 
                onClick={onClose} 
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowChangePassword(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
              <h4 className="text-lg font-semibold text-gray-900">Change Password</h4>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                <ul className="space-y-1">
                  <li className={`text-xs flex items-center gap-2 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordRequirements.length ? <span className="text-green-600">✓</span> : <span className="text-gray-400">○</span>}
                    At least 8 characters
                  </li>
                  <li className={`text-xs flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordRequirements.uppercase ? <span className="text-green-600">✓</span> : <span className="text-gray-400">○</span>}
                    One uppercase letter
                  </li>
                  <li className={`text-xs flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordRequirements.lowercase ? <span className="text-green-600">✓</span> : <span className="text-gray-400">○</span>}
                    One lowercase letter
                  </li>
                  <li className={`text-xs flex items-center gap-2 ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordRequirements.number ? <span className="text-green-600">✓</span> : <span className="text-gray-400">○</span>}
                    One number
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordChanging || !currentPassword || !Object.values(passwordRequirements).every(req => req)}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                {passwordChanging ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
