import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  Search, 
  ShieldCheck, 
  Database, 
  Bot, 
  LogOut, 
  Plus, 
  RefreshCw, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Eye, 
  Sparkles,
  Phone,
  Mail,
  AlertCircle,
  Clock,
  TrendingUp,
  Activity,
  Menu,
  X,
  Sliders,
  Palette,
  Video,
  MapPin,
  User,
  ShieldAlert,
  Globe,
  Layers
} from 'lucide-react';
import { JSGLogo } from '../../components/JSGLogo';
import { PropertyModalEditor } from './components/PropertyModalEditor';
import { PageModalEditor } from './components/PageModalEditor';
import { LeadModalEditor } from './components/LeadModalEditor';
import { HeaderNavEditor } from './components/HeaderNavEditor';
import { HeroEditor } from './components/HeroEditor';
import { SlidersEditor } from './components/SlidersEditor';
import { FounderEditor } from './components/FounderEditor';
import { PartnersEditor } from './components/PartnersEditor';
import { AreasBuildingsEditor } from './components/AreasBuildingsEditor';
import { VideosEditor } from './components/VideosEditor';
import { AllSectionsEditor } from './components/AllSectionsEditor';
import { GalleryEditor } from './components/GalleryEditor';
import { InfiniteListingsEditor } from './components/InfiniteListingsEditor';
import { FooterEditor } from './components/FooterEditor';
import { ThemeEditor } from './components/ThemeEditor';
import { AccountSettingsEditor } from './components/AccountSettingsEditor';
import { AuditLogViewer } from './components/AuditLogViewer';
import { SecurityCenterViewer } from './components/SecurityCenterViewer';
import { useSiteData } from '../../context/SiteDataContext';

export const AdminControlCenter: React.FC = () => {
  const navigate = useNavigate();
  const { syncState, contentVersion } = useSiteData();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'header'
    | 'navigation'
    | 'hero'
    | 'sliders'
    | 'founder'
    | 'videos'
    | 'sections'
    | 'gallery'
    | 'infinite-listings'
    | 'areas'
    | 'partners'
    | 'footer'
    | 'theme'
    | 'properties'
    | 'pages'
    | 'content'
    | 'leads'
    | 'appointments'
    | 'media'
    | 'seo'
    | 'ai'
    | 'security'
    | 'backups'
    | 'account'
    | 'audit'
  >('dashboard');

  const [adminUser, setAdminUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Live Data States
  const [stats, setStats] = useState<any>({
    activeProperties: 0,
    totalLeads: 0,
    newLeads: 0,
    pendingAppointments: 0,
    totalInventoryValue: 0,
    connectedClients: 1,
    contentVersion: 1
  });

  const [properties, setProperties] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [sections, setSections] = useState<any>(null);
  const [communityImages, setCommunityImages] = useState<Record<string, string>>({});
  const [aiSettings, setAiSettings] = useState<any>(null);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [propSearch, setPropSearch] = useState('');
  const [propModeFilter, setPropModeFilter] = useState<'all' | 'buy' | 'rent'>('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [isPropModalOpen, setIsPropModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Notification / Alert
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Auth Guard
  useEffect(() => {
    const token = localStorage.getItem('jsg_admin_token');
    const userStr = localStorage.getItem('jsg_admin_user');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    setAuthToken(token);
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (_) {}
    }
  }, [navigate]);

  // Fetch Full Admin State
  const fetchAdminData = useCallback(async () => {
    const token = localStorage.getItem('jsg_admin_token');
    if (!token) return;

    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [dashRes, propsRes, pagesRes, leadsRes, aptsRes, contentRes, mediaRes, auditRes, revRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers }),
        fetch('/api/properties'),
        fetch('/api/admin/pages', { headers }),
        fetch('/api/admin/leads', { headers }),
        fetch('/api/admin/appointments', { headers }),
        fetch('/api/content'),
        fetch('/api/admin/media', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
        fetch('/api/admin/revisions', { headers })
      ]);

      if (dashRes.status === 401) {
        localStorage.removeItem('jsg_admin_token');
        navigate('/admin/login');
        return;
      }

      if (dashRes.ok) {
        const d = await dashRes.json();
        setStats(d.stats);
      }
      if (propsRes.ok) setProperties(await propsRes.json());
      if (pagesRes.ok) setPages(await pagesRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (aptsRes.ok) setAppointments(await aptsRes.json());
      if (contentRes.ok) {
        const c = await contentRes.json();
        setSettings(c.settings);
        setSections(c.sections);
        setAiSettings(c.aiSettings);
        if (c.communityImages) setCommunityImages(c.communityImages);
      }
      if (mediaRes.ok) setMediaList(await mediaRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
      if (revRes.ok) setRevisions(await revRes.json());
    } catch (err) {
      console.error('Failed fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 10000); // 10s polling fallback in addition to SSE
    return () => clearInterval(interval);
  }, [fetchAdminData]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (_) {}
    localStorage.removeItem('jsg_admin_token');
    localStorage.removeItem('jsg_admin_user');
    navigate('/admin/login');
  };

  // Property Handlers
  const handleSaveProperty = async (propData: any) => {
    try {
      const isEdit = Boolean(selectedProperty && selectedProperty.id);
      const url = isEdit ? `/api/admin/properties/${selectedProperty.id}` : '/api/admin/properties';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(propData)
      });

      if (res.ok) {
        showNotification(isEdit ? 'Property updated & synchronized live.' : 'New property published to live website.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Error saving property');
    }
  };

  const handleDeleteProperty = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this listing from the database?')) return;
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        showNotification('Property removed from database.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  // Page Handlers
  const handleSavePage = async (pageData: any) => {
    try {
      const isEdit = Boolean(selectedPage && selectedPage.id);
      const url = isEdit ? `/api/admin/pages/${selectedPage.id}` : '/api/admin/pages';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(pageData)
      });

      if (res.ok) {
        showNotification('Dynamic page saved and published.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Error saving dynamic page');
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Delete this dynamic page?')) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        showNotification('Page deleted.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to delete page');
    }
  };

  // Lead Handlers
  const handleUpdateLead = async (leadId: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        showNotification('Lead pipeline stage updated.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update lead');
    }
  };

  // Appointment Status Toggle
  const handleToggleAppointmentStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Pending' ? 'Confirmed' : currentStatus === 'Confirmed' ? 'Completed' : 'Cancelled';
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        showNotification(`Appointment marked as ${nextStatus}.`);
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update appointment');
    }
  };

  // Save Global Settings
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showNotification('Global website identity & contact settings saved.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  // Save Sections & Founder Bio
  const handleSaveSections = async () => {
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(sections)
      });
      if (res.ok) {
        showNotification('Hero slides, founder bio & section settings updated.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to save sections');
    }
  };

  // Save AI Assistant Settings
  const handleSaveAISettings = async () => {
    try {
      const res = await fetch('/api/admin/ai-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(aiSettings)
      });
      if (res.ok) {
        showNotification('AI concierge settings updated.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to save AI settings');
    }
  };

  // Snapshot Database
  const handleCreateSnapshot = async () => {
    const desc = prompt('Enter a label for this manual snapshot:', 'Manual Checkpoint');
    if (!desc) return;

    try {
      const res = await fetch('/api/admin/revisions/snapshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ description: desc })
      });
      if (res.ok) {
        showNotification('Database snapshot created successfully.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to create snapshot');
    }
  };

  // Restore Revision
  const handleRestoreRevision = async (revId: string) => {
    if (!confirm('Restore database state to this revision? Current unsaved changes will be superseded.')) return;

    try {
      const res = await fetch(`/api/admin/revisions/${revId}/restore`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        showNotification('Database restored to revision point.');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to restore revision');
    }
  };

  // CSV Lead Export
  const handleExportLeadsCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Property', 'Budget', 'Status', 'Priority', 'AssignedAgent', 'Requirements'];
    const rows = leads.map(l => [
      l.id,
      new Date(l.createdAt).toLocaleDateString(),
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${(l.interestedProperty || '').replace(/"/g, '""')}"`,
      `"${l.budget || ''}"`,
      l.status,
      l.priority,
      l.assignedAgent,
      `"${(l.requirement || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jsg_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Navigation tabs config grouped by architectural responsibility in priority order
  const navTabs = [
    { id: 'dashboard', label: 'Control Overview', icon: LayoutDashboard },
    { id: 'header', label: '1. Header (Logo & Bar)', icon: Building2 },
    { id: 'navigation', label: '2. Navigation & Menus', icon: Globe },
    { id: 'hero', label: '3. Hero Section', icon: Sparkles },
    { id: 'sliders', label: '4. Sliders & Showcase', icon: Sliders },
    { id: 'founder', label: '5. Founder Profile', icon: ShieldCheck },
    { id: 'videos', label: '6. 3D Scroll / Videos', icon: Video },
    { id: 'sections', label: '7. All Sections', icon: Layers },
    { id: 'gallery', label: '8. Gallery', icon: ImageIcon },
    { id: 'infinite-listings', label: '9. Infinite Listings', icon: Sparkles },
    { id: 'areas', label: '10. Areas & Towers', icon: MapPin },
    { id: 'partners', label: '10b. Master Partners', icon: Building2 },
    { id: 'footer', label: '11. Footer & Legal', icon: FileText },
    { id: 'theme', label: '12. Theme & Styling', icon: Palette },
    { id: 'properties', label: 'Properties CMS', icon: Building2, count: properties.length },
    { id: 'pages', label: 'Pages & Subpages', icon: FileText, count: pages.length },
    { id: 'leads', label: 'Leads CRM', icon: Users, count: stats.newLeads },
    { id: 'appointments', label: 'Calls & Viewings', icon: Calendar, count: stats.pendingAppointments },
    { id: 'account', label: 'Admin Account (Maleeka)', icon: User },
    { id: 'security', label: 'Security Center', icon: ShieldCheck },
    { id: 'audit', label: 'Audit Log', icon: Clock },
    { id: 'backups', label: 'Revisions & Backup', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-[#0d1e1a] text-slate-100 flex flex-col font-sans selection:bg-[#b58b4a] selection:text-white">
      {/* Top Enterprise Control Bar */}
      <header className="bg-[#142e27] border-b border-[#b58b4a]/30 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <JSGLogo size="sm" theme="dark" showText={false} />
            <div className="hidden sm:block">
              <span className="font-extrabold text-sm tracking-wider text-white block leading-none">
                MALEEKA — JSG REAL ESTATE
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#d9bf8c] font-bold">
                Website Content Control Panel
              </span>
            </div>
          </div>
        </div>

        {/* Center Live Sync Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                syncState === 'synced'
                  ? 'bg-emerald-400 animate-pulse'
                  : syncState === 'saving'
                  ? 'bg-amber-400 animate-spin'
                  : syncState === 'saved'
                  ? 'bg-emerald-300'
                  : 'bg-slate-400'
              }`}
            />
            <span className="text-[11px] font-semibold text-slate-200">
              {syncState === 'synced'
                ? `Synced (v${contentVersion})`
                : syncState === 'saving'
                ? 'Syncing changes...'
                : syncState === 'saved'
                ? 'Saved & Broadcast'
                : 'Offline Storage'}
            </span>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-[#fae7b5] border border-white/10 transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Right User Status & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-bold text-white">{adminUser?.name || 'Super Administrator'}</span>
            <span className="text-[10px] text-[#d9bf8c] uppercase font-mono">{adminUser?.role || 'Principal'}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors"
            title="Sign out of Control Center"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Global Notification Banner */}
      {bannerNotice && (
        <div className="bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md animate-fade-in sticky top-[57px] z-30">
          <Sparkles className="w-4 h-4" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`w-64 bg-[#11241f] border-r border-white/5 flex flex-col shrink-0 z-30 transition-all duration-300 ${
            mobileNavOpen ? 'fixed inset-y-0 left-0 top-[57px] z-50' : 'hidden lg:flex'
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto flex-1">
            <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Core Navigation
            </div>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#b58b4a] to-[#996f2e] text-[#142621] font-bold shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#142621]' : 'text-[#b58b4a]'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-[#142621] text-[#fae7b5]' : 'bg-[#b58b4a]/20 text-[#fae7b5]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-white/5 text-[11px] text-slate-400 space-y-2">
            <div className="flex justify-between items-center">
              <span>Database Sync</span>
              <span className="text-emerald-400 font-mono font-bold">SSE v{stats.contentVersion}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Security</span>
              <span className="text-slate-200">PBKDF2 / JWT</span>
            </div>
          </div>
        </aside>

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0d1e1a]">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
              {/* Executive Welcome & Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#fbfaf7] tracking-tight">
                    Executive Control Overview
                  </h1>
                  <p className="text-xs text-[#d9bf8c] mt-1">
                    Central source of truth for Dubai luxury portfolio, inquiries, and platform publishing.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProperty(null);
                      setIsPropModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold text-xs shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Property</span>
                  </button>
                  <button
                    type="button"
                    onClick={fetchAdminData}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                    title="Force refresh data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#142e27] border border-white/10 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Inventory</span>
                    <Building2 className="w-5 h-5 text-[#b58b4a]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.activeProperties}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Live on Public Showcase
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#142e27] border border-white/10 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Value (AED)</span>
                    <TrendingUp className="w-5 h-5 text-[#fae7b5]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#fae7b5]">
                    AED {(stats.totalInventoryValue / 1_000_000).toFixed(1)}M
                  </div>
                  <div className="text-[10px] text-[#d9bf8c]">Prime Dubai Real Estate</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#142e27] border border-white/10 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer Inquiries</span>
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalLeads}</div>
                  <div className="text-[10px] text-amber-300 font-semibold">
                    {stats.newLeads} New Leads Awaiting Action
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#142e27] border border-white/10 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Viewings & Calls</span>
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.pendingAppointments}</div>
                  <div className="text-[10px] text-slate-400">Scheduled Consultations</div>
                </div>
              </div>

              {/* Quick Actions & Live Stream Health */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Leads Feed */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#b58b4a]" />
                      <h2 className="text-base font-bold text-white">Priority Leads Pipeline</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('leads')}
                      className="text-xs text-[#d9bf8c] hover:underline font-semibold"
                    >
                      View All Leads →
                    </button>
                  </div>

                  <div className="divide-y divide-white/5 space-y-2">
                    {leads.slice(0, 5).map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsLeadModalOpen(true);
                        }}
                        className="pt-2 flex items-center justify-between py-3 hover:bg-white/5 px-2 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{lead.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#b58b4a]/20 text-[#fae7b5] font-semibold border border-[#b58b4a]/30">
                              {lead.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {lead.phone} {lead.interestedProperty ? `· ${lead.interestedProperty}` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {leads.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400">No leads logged yet.</div>
                    )}
                  </div>
                </div>

                {/* System Activity & Quick Audit */}
                <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#fae7b5]" />
                    <h2 className="text-base font-bold text-white">Live System Audit</h2>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto text-xs">
                    {auditLogs.slice(0, 7).map((log) => (
                      <div key={log.id} className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-[#d9bf8c]">{log.action}</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-200 text-[11px] leading-tight">{log.details}</p>
                        <div className="text-[9px] text-slate-400 font-mono">By: {log.userEmail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES CMS */}
          {activeTab === 'properties' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Properties & Trophy Residences</h1>
                  <p className="text-xs text-[#d9bf8c]">
                    Manage active sales, rental listings, virtual tours, and price points.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProperty(null);
                    setIsPropModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Property</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={propSearch}
                    onChange={(e) => setPropSearch(e.target.value)}
                    placeholder="Search by title, location, community, or developer..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#142e27] border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#b58b4a]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPropModeFilter('all')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold ${
                      propModeFilter === 'all' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/5 text-slate-300'
                    }`}
                  >
                    All Modes
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropModeFilter('buy')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold ${
                      propModeFilter === 'buy' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/5 text-slate-300'
                    }`}
                  >
                    For Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropModeFilter('rent')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold ${
                      propModeFilter === 'rent' ? 'bg-[#b58b4a] text-[#142621]' : 'bg-white/5 text-slate-300'
                    }`}
                  >
                    For Rent
                  </button>
                </div>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties
                  .filter((p) => {
                    if (propModeFilter !== 'all' && (p.mode || 'buy') !== propModeFilter) return false;
                    if (propSearch) {
                      const q = propSearch.toLowerCase();
                      return (
                        p.title.toLowerCase().includes(q) ||
                        p.location.toLowerCase().includes(q) ||
                        (p.community && p.community.toLowerCase().includes(q))
                      );
                    }
                    return true;
                  })
                  .map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-[#142e27] border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-[#b58b4a]/50 transition-all group flex flex-col"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-2.5 py-1 rounded-md bg-[#142621]/90 backdrop-blur-sm text-[10px] font-extrabold uppercase text-[#fae7b5] border border-white/10">
                            {prop.type || prop.category}
                          </span>
                          {prop.isFeatured && (
                            <span className="px-2 py-1 rounded-md bg-[#b58b4a] text-[10px] font-bold text-[#142621]">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm text-xs font-black text-[#fae7b5]">
                          AED {prop.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
                        <div>
                          <h3 className="font-bold text-white text-sm line-clamp-1">{prop.title}</h3>
                          <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-1">{prop.location}</p>
                          <div className="flex items-center gap-3 text-slate-300 text-[11px] mt-2">
                            <span>{prop.beds} Beds</span>
                            <span>·</span>
                            <span>{prop.baths} Baths</span>
                            <span>·</span>
                            <span>{prop.area} Sqft</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              prop.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {prop.status?.toUpperCase() || 'ACTIVE'}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProperty(prop);
                                setIsPropModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d9bf8c]"
                              title="Edit listing"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProperty(prop.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              title="Delete listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAGES & SUBPAGES */}
          {activeTab === 'pages' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white">Dynamic Pages & Navigation</h1>
                  <p className="text-xs text-[#d9bf8c]">
                    Create and publish custom landing pages, guide sections, and subpages without writing code.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPage(null);
                    setIsPageModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Page</span>
                </button>
              </div>

              <div className="bg-[#142e27] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 text-[#fae7b5] uppercase tracking-wider text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-4">Title & Slug</th>
                      <th className="p-4">Placement</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Blocks</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pages.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{p.title}</div>
                          <div className="text-[11px] text-slate-400 font-mono">/p/{p.slug}</div>
                        </td>
                        <td className="p-4 text-slate-300 uppercase text-[11px]">
                          {p.navPlacement}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                            }`}
                          >
                            {p.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">
                          {p.blocks?.length || 0} Sections
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <a
                            href={`/p/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
                            title="Preview Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPage(p);
                              setIsPageModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d9bf8c]"
                            title="Edit Page"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePage(p.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            title="Delete Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pages.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          No custom pages created yet. Click "New Page" to create your first landing page.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CONTENT & SECTIONS */}
          {activeTab === 'content' && settings && sections && (
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white">Global Content & Branding Editor</h1>
                  <p className="text-xs text-[#d9bf8c]">
                    Everything on the website is editable from this single source of truth.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleSaveSettings();
                    handleSaveSections();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-lg hover:opacity-95 cursor-pointer"
                >
                  Save All Website Changes
                </button>
              </div>

              {/* 1. Branding & Identity */}
              <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#b58b4a]" />
                  <span>Branding & Identity</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Company / Brand Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">RERA Broker License #</label>
                    <input
                      type="text"
                      value={settings.reraLicense}
                      onChange={(e) => setSettings({ ...settings, reraLicense: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-semibold text-slate-300">Brand Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Contact & WhatsApp Routing */}
              <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#b58b4a]" />
                  <span>Contact & Direct Lead Channels</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Primary Telephone</label>
                    <input
                      type="text"
                      value={settings.contact.phone}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, phone: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Direct WhatsApp Number</label>
                    <input
                      type="text"
                      value={settings.contact.whatsapp}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, whatsapp: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Primary Email Desk</label>
                    <input
                      type="text"
                      value={settings.contact.email}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, email: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="font-semibold text-slate-300">Headquarters Physical Location</label>
                    <input
                      type="text"
                      value={settings.contact.location}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, location: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Founder Profile & Bio */}
              <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-[#fae7b5] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#b58b4a]" />
                  <span>Founder & CEO Executive Profile</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Founder Name</label>
                    <input
                      type="text"
                      value={sections.founder.name}
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          founder: { ...sections.founder, name: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Executive Title</label>
                    <input
                      type="text"
                      value={sections.founder.title}
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          founder: { ...sections.founder, title: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Transaction Volume Stat</label>
                    <input
                      type="text"
                      value={sections.founder.dealsVolume}
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          founder: { ...sections.founder, dealsVolume: e.target.value }
                        })
                      }
                      placeholder="AED 4.8B+"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#fae7b5] font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Experience Years</label>
                    <input
                      type="number"
                      value={sections.founder.experienceYears}
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          founder: { ...sections.founder, experienceYears: Number(e.target.value) }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-semibold text-slate-300">Executive Statement</label>
                    <textarea
                      rows={3}
                      value={sections.founder.executiveStatement}
                      onChange={(e) =>
                        setSections({
                          ...sections,
                          founder: { ...sections.founder, executiveStatement: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Section Visibility Toggles */}
              <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-[#fae7b5]">Section Visibility Control</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer">
                    <span className="font-semibold text-slate-200">Show Quick Discovery Cards</span>
                    <input
                      type="checkbox"
                      checked={sections.quickCardsVisible}
                      onChange={(e) => setSections({ ...sections, quickCardsVisible: e.target.checked })}
                      className="rounded accent-[#b58b4a] w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer">
                    <span className="font-semibold text-slate-200">Show Live Walkthrough Banner</span>
                    <input
                      type="checkbox"
                      checked={sections.liveBannerVisible}
                      onChange={(e) => setSections({ ...sections, liveBannerVisible: e.target.checked })}
                      className="rounded accent-[#b58b4a] w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer">
                    <span className="font-semibold text-slate-200">Show Developers Logo Strip</span>
                    <input
                      type="checkbox"
                      checked={sections.developersStripVisible}
                      onChange={(e) => setSections({ ...sections, developersStripVisible: e.target.checked })}
                      className="rounded accent-[#b58b4a] w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer">
                    <span className="font-semibold text-slate-200">Show Featured Strip</span>
                    <input
                      type="checkbox"
                      checked={sections.featuredPropertiesVisible}
                      onChange={(e) => setSections({ ...sections, featuredPropertiesVisible: e.target.checked })}
                      className="rounded accent-[#b58b4a] w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LEADS CRM */}
          {activeTab === 'leads' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Institutional Leads CRM</h1>
                  <p className="text-xs text-[#d9bf8c]">
                    Track incoming client inquiries, customer requirements, stage transitions, and broker notes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportLeadsCSV}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold text-xs border border-white/15 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Status Tabs Filter */}
              <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                {['all', 'New', 'Contacted', 'Qualified', 'Viewing Scheduled', 'Negotiation', 'Converted', 'Lost'].map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setLeadStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                        leadStatusFilter === st
                          ? 'bg-[#b58b4a] text-[#142621]'
                          : 'bg-[#142e27] text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {st === 'all' ? 'All Leads' : st}
                    </button>
                  )
                )}
              </div>

              {/* Leads Table */}
              <div className="bg-[#142e27] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 text-[#fae7b5] uppercase tracking-wider text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Property / Requirement</th>
                      <th className="p-4">Stage</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Assigned Agent</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads
                      .filter((l) => leadStatusFilter === 'all' || l.status === leadStatusFilter)
                      .map((lead) => (
                        <tr
                          key={lead.id}
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsLeadModalOpen(true);
                          }}
                          className="hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{lead.name}</div>
                            <div className="text-[11px] text-slate-400">{lead.phone}</div>
                          </td>
                          <td className="p-4 max-w-xs">
                            <div className="font-semibold text-slate-200 truncate">
                              {lead.interestedProperty || 'General Luxury Portfolio'}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {lead.budget ? `Budget: ${lead.budget} · ` : ''}
                              {lead.requirement || 'No notes provided'}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-[#b58b4a]/20 text-[#fae7b5] font-bold text-[10px] border border-[#b58b4a]/30">
                              {lead.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                lead.priority === 'Urgent'
                                  ? 'bg-red-500/20 text-red-400'
                                  : lead.priority === 'High'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-white/10 text-slate-300'
                              }`}
                            >
                              {lead.priority}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300 font-medium">
                            {lead.assignedAgent}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#d9bf8c] font-bold text-[11px]"
                            >
                              Manage →
                            </button>
                          </td>
                        </tr>
                      ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No leads matching current criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: APPOINTMENTS & CALLS */}
          {activeTab === 'appointments' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white">Viewing Requests & Calls</h1>
                  <p className="text-xs text-[#d9bf8c]">
                    Automated appointment bookings from public website and AI Concierge.
                  </p>
                </div>
              </div>

              <div className="bg-[#142e27] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 text-[#fae7b5] uppercase tracking-wider text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-4">Client</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Purpose / Property</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{apt.customerName}</div>
                          <div className="text-[11px] text-slate-400">{apt.phone}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-200">{apt.preferredDate}</div>
                          <div className="text-[11px] text-slate-400">{apt.preferredTime || 'Anytime'}</div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="font-semibold text-[#fae7b5]">
                            {apt.propertyTitle || 'General Consultation'}
                          </div>
                          <div className="text-[11px] text-slate-400">{apt.purpose}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              apt.status === 'Confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : apt.status === 'Pending'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-slate-500/20 text-slate-400'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleAppointmentStatus(apt.id, apt.status)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d9bf8c] font-bold text-[11px]"
                          >
                            Advance Status
                          </button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          No pending appointments.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white">Media Assets & Gallery</h1>
                  <p className="text-xs text-[#d9bf8c]">
                    Upload and manage high-resolution photos, architectural renders, and brochures.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {mediaList.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-2xl bg-[#142e27] border border-white/10 space-y-2 flex flex-col justify-between"
                  >
                    <img
                      src={m.url}
                      alt={m.filename}
                      className="h-32 w-full object-cover rounded-xl border border-white/10"
                    />
                    <div className="truncate">
                      <div className="font-bold text-white truncate text-[11px]">{m.filename}</div>
                      <div className="text-[10px] text-slate-400">{m.category}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(m.url);
                        showNotification('Media URL copied to clipboard.');
                      }}
                      className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d9bf8c] font-bold flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SEO & PERFORMANCE */}
          {activeTab === 'seo' && settings && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-xs">
              <div>
                <h1 className="text-2xl font-black text-white">Global SEO Suite & Performance</h1>
                <p className="text-xs text-[#d9bf8c]">
                  Configure search engine metadata, OpenGraph previews, and platform performance.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Default Meta Title</label>
                  <input
                    type="text"
                    value={settings.seo.defaultTitle}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, defaultTitle: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Default Meta Description</label>
                  <textarea
                    rows={3}
                    value={settings.seo.defaultDescription}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, defaultDescription: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Target Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    value={settings.seo.keywords}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, keywords: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold"
                  >
                    Save SEO Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: AI CONCIERGE SETTINGS */}
          {activeTab === 'ai' && aiSettings && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white">AI Concierge & Voice Suite</h1>
                  <p className="text-xs text-[#d9bf8c]">
                    Configure the conversational Gemini 3.8 Flash luxury property assistant.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAISettings}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-md"
                >
                  Save AI Settings
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#142e27] border border-white/10 shadow-xl space-y-4">
                <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer">
                  <span className="font-semibold text-slate-200">Enable AI Concierge on Website</span>
                  <input
                    type="checkbox"
                    checked={aiSettings.enabled}
                    onChange={(e) => setAiSettings({ ...aiSettings, enabled: e.target.checked })}
                    className="rounded accent-[#b58b4a] w-4 h-4"
                  />
                </label>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Assistant Display Name</label>
                  <input
                    type="text"
                    value={aiSettings.assistantName}
                    onChange={(e) => setAiSettings({ ...aiSettings, assistantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Welcome Message</label>
                  <textarea
                    rows={2}
                    value={aiSettings.welcomeMessage}
                    onChange={(e) => setAiSettings({ ...aiSettings, welcomeMessage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white leading-relaxed"
                  />
                </div>

                <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer">
                  <span className="font-semibold text-slate-200">Enable Natural Speech Synthesis (Voice Output)</span>
                  <input
                    type="checkbox"
                    checked={aiSettings.enableVoice}
                    onChange={(e) => setAiSettings({ ...aiSettings, enableVoice: e.target.checked })}
                    className="rounded accent-[#b58b4a] w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}

          {/* MODULAR SECTION EDITORS */}
          {(activeTab === 'header' || activeTab === 'navigation') && settings && (
            <HeaderNavEditor
              settings={settings}
              setSettings={setSettings}
              onSave={handleSaveSettings}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'hero' && sections && (
            <HeroEditor
              sections={sections}
              setSections={setSections}
              onSave={handleSaveSections}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'sliders' && sections && (
            <SlidersEditor
              sections={sections}
              setSections={setSections}
              onSave={handleSaveSections}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'founder' && sections && (
            <FounderEditor
              sections={sections}
              setSections={setSections}
              onSave={handleSaveSections}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'videos' && settings && (
            <VideosEditor
              settings={settings}
              setSettings={setSettings}
              onSave={handleSaveSettings}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'sections' && sections && (
            <AllSectionsEditor
              sections={sections}
              setSections={setSections}
              onSave={handleSaveSections}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'gallery' && sections && (
            <GalleryEditor
              sections={sections}
              setSections={setSections}
              onSave={handleSaveSections}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'infinite-listings' && sections && (
            <InfiniteListingsEditor
              sections={sections}
              setSections={setSections}
              onSave={handleSaveSections}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'partners' && settings && (
            <PartnersEditor
              settings={settings}
              setSettings={setSettings}
              onSave={handleSaveSettings}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'areas' && (
            <AreasBuildingsEditor
              communityImages={communityImages}
              setCommunityImages={setCommunityImages}
              settings={settings}
              setSettings={setSettings}
              authToken={authToken}
              onSave={handleSaveSettings}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'footer' && settings && (
            <FooterEditor
              settings={settings}
              setSettings={setSettings}
              onSave={handleSaveSettings}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'theme' && settings && (
            <ThemeEditor
              settings={settings}
              setSettings={setSettings}
              onSave={handleSaveSettings}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'account' && (
            <AccountSettingsEditor
              currentUser={adminUser}
              authToken={authToken}
              showNotification={showNotification}
              onLogout={handleLogout}
            />
          )}

          {/* TAB: SECURITY CENTER */}
          {activeTab === 'security' && (
            <SecurityCenterViewer
              authToken={authToken}
              showNotification={showNotification}
            />
          )}

          {/* TAB: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <AuditLogViewer
              auditLogs={auditLogs}
              showNotification={showNotification}
            />
          )}

          {/* TAB 11: REVISIONS & BACKUP */}
          {activeTab === 'backups' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white">Revisions & Disaster Recovery</h1>
                  <p className="text-xs text-[#d9bf8c]">
                    Automated snapshots, manual backup points, and single-click rollbacks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateSnapshot}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Manual Snapshot</span>
                </button>
              </div>

              <div className="bg-[#142e27] rounded-3xl border border-white/10 overflow-hidden shadow-xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-[#fae7b5]">Database Revision Snapshots</h2>
                <div className="divide-y divide-white/5">
                  {revisions.map((rev) => (
                    <div key={rev.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">{rev.description}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(rev.timestamp).toLocaleString()} · By {rev.author}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRestoreRevision(rev.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold"
                      >
                        Restore to Point
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Property Editor Modal */}
      {isPropModalOpen && (
        <PropertyModalEditor
          property={selectedProperty}
          isOpen={isPropModalOpen}
          onClose={() => setIsPropModalOpen(false)}
          onSave={handleSaveProperty}
        />
      )}

      {/* Page Editor Modal */}
      {isPageModalOpen && (
        <PageModalEditor
          page={selectedPage}
          isOpen={isPageModalOpen}
          onClose={() => setIsPageModalOpen(false)}
          onSave={handleSavePage}
        />
      )}

      {/* Lead Editor Modal */}
      {isLeadModalOpen && (
        <LeadModalEditor
          lead={selectedLead}
          isOpen={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
          onUpdate={handleUpdateLead}
        />
      )}
    </div>
  );
};
