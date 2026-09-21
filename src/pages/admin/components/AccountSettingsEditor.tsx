import React, { useState } from 'react';
import { 
  User, 
  Key, 
  ShieldCheck, 
  Save, 
  Check, 
  AlertCircle,
  Smartphone,
  Lock
} from 'lucide-react';

interface AccountSettingsEditorProps {
  currentUser: any;
  authToken: string;
  showNotification: (msg: string) => void;
  onLogout: () => void;
}

export const AccountSettingsEditor: React.FC<AccountSettingsEditorProps> = ({
  currentUser,
  authToken,
  showNotification,
  onLogout
}) => {
  const [name, setName] = useState(currentUser?.name || 'MALEEK');
  const [email, setEmail] = useState(currentUser?.email || 'admin@jsgrealestate.ae');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [isUpdatingPwd, setIsUpdatingPwd] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          twoFactorEnabled
        })
      });

      if (res.ok) {
        showNotification('Admin profile updated successfully.');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      alert('Error updating profile');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');

    if (!currentPassword) {
      setPwdError('Current password is required.');
      return;
    }

    if (newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match.');
      return;
    }

    setIsUpdatingPwd(true);
    try {
      const res = await fetch('/api/admin/account/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        showNotification('Master password updated securely.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwdError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setPwdError('Network error while updating password');
    } finally {
      setIsUpdatingPwd(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-xs">
      <div>
        <h1 className="text-2xl font-black text-white">Administrator Account Settings</h1>
        <p className="text-xs text-[#d9bf8c]">
          Manage master identity credentials, cryptographic password hashing, and two-factor authentication.
        </p>
      </div>

      {/* 1. Identity Card */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-white/5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#b58b4a] to-[#996f2e] text-[#142621] flex items-center justify-center font-black text-xl shadow-lg">
            M
          </div>
          <div>
            <div className="text-lg font-black text-white">MALEEK — JSG REAL ESTATE</div>
            <div className="text-slate-400 text-xs">Master System Administrator · Role: Super Admin</div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Admin Email / Username</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#b58b4a]" />
              <div>
                <div className="font-bold text-white">Two-Factor Authentication (2FA)</div>
                <div className="text-slate-400 text-[11px]">Require authenticator code on administrative logins</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b58b4a]" />
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-md hover:opacity-95 cursor-pointer"
          >
            Save Account Profile
          </button>
        </form>
      </div>

      {/* 2. Cryptographic Password Management */}
      <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
          <Key className="w-4 h-4 text-[#b58b4a]" />
          <span>Change Master Administrator Password</span>
        </h2>
        <p className="text-slate-400 text-[11px]">
          Passwords are encrypted using server-side PBKDF2 with HMAC-SHA512 (10,000 iterations and unique 64-byte cryptographic salts).
        </p>

        {pwdError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pwdError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">New Secure Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingPwd}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold border border-white/10 cursor-pointer disabled:opacity-50"
          >
            {isUpdatingPwd ? 'Updating Cryptographic Hash...' : 'Update Master Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
