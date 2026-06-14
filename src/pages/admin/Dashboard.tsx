import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { 
  Sparkles, LogOut, FileText, Briefcase, Code, Award, 
  Settings, Save, Plus, Trash2, Edit, Upload, Check, AlertCircle, RefreshCw 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Form states
  const [heroData, setHeroData] = useState({
    greeting: '', name: '', subtitle: '', description: '',
    resumeLink: '', githubLink: '', linkedinLink: '', instagramLink: '', openForProjects: true
  });

  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    _id: '', title: '', category: '', description: '', technologies: '', githubLink: '', demoLink: '', image: '', isHidden: false
  });

  const [companies, setCompanies] = useState([]);
  const [companyForm, setCompanyForm] = useState({
    _id: '', company: '', logo: '', badge: '', role: '', timeline: '', description: '', highlights: '',
    color: 'from-[#d946ef]/5 to-[#8b1ff5]/5', borderColor: 'hover:border-[#d946ef]/40', glowColor: 'bg-[#d946ef]/5'
  });

  const [skills, setSkills] = useState([]);
  const [skillForm, setSkillForm] = useState({
    _id: '', title: '', icon: 'Layers', side: 'left', skillsList: ''
  });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (!storedToken) {
      navigate('/admin/login');
      return;
    }
    setToken(storedToken);
    fetchData(storedToken);
  }, []);

  const showMsg = (text: string, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const fetchData = async (authToken: string) => {
    try {
      // Fetch Hero
      const resHero = await fetch(`${API_URL}/api/hero`);
      if (resHero.ok) {
        const dHero = await resHero.json();
        setHeroData(dHero);
      }

      // Fetch Projects
      const resProjects = await fetch(`${API_URL}/api/projects`);
      if (resProjects.ok) setProjects(await resProjects.json());

      // Fetch Companies
      const resCompanies = await fetch(`${API_URL}/api/companies`);
      if (resCompanies.ok) setCompanies(await resCompanies.json());

      // Fetch Skills
      const resSkills = await fetch(`${API_URL}/api/skills`);
      if (resSkills.ok) setSkills(await resSkills.json());

    } catch (err) {
      showMsg('Failed to load portfolio database', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  // Image upload helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'company' | 'project') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      if (type === 'company') {
        setCompanyForm(prev => ({ ...prev, logo: data.url }));
      } else {
        setProjectForm(prev => ({ ...prev, image: data.url }));
      }
      showMsg('Image uploaded successfully!');
    } catch (err: any) {
      showMsg(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 1. Hero Submit
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(heroData)
      });
      if (res.ok) {
        showMsg('Hero layout updated successfully!');
      } else {
        throw new Error('Failed to update hero');
      }
    } catch (err: any) {
      showMsg(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Projects Handlers
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };

    const isEdit = !!projectForm._id;
    const url = isEdit 
      ? `${API_URL}/api/projects/${projectForm._id}` 
      : `${API_URL}/api/projects`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        showMsg(isEdit ? 'Project updated!' : 'Project created!');
        setProjectForm({ _id: '', title: '', category: '', description: '', technologies: '', githubLink: '', demoLink: '', image: '', isHidden: false });
        fetchData(token);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Project save failed');
      }
    } catch (err: any) {
      showMsg(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showMsg('Project deleted');
        fetchData(token);
      }
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  // 3. Companies Handlers
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      ...companyForm,
      highlights: typeof companyForm.highlights === 'string' 
        ? companyForm.highlights.split(',').map(t => t.trim()).filter(Boolean)
        : companyForm.highlights
    };

    const isEdit = !!companyForm._id;
    const url = isEdit 
      ? `${API_URL}/api/companies/${companyForm._id}` 
      : `${API_URL}/api/companies`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        showMsg(isEdit ? 'Company info updated!' : 'Company added!');
        setCompanyForm({
          _id: '', company: '', logo: '', badge: '', role: '', timeline: '', description: '', highlights: '',
          color: 'from-[#d946ef]/5 to-[#8b1ff5]/5', borderColor: 'hover:border-[#d946ef]/40', glowColor: 'bg-[#d946ef]/5'
        });
        fetchData(token);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Company save failed');
      }
    } catch (err: any) {
      showMsg(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id: string) => {
    if (!window.confirm('Delete this company association?')) return;
    try {
      const res = await fetch(`${API_URL}/api/companies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showMsg('Company deleted');
        fetchData(token);
      }
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  // 4. Skills Handlers
  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      title: skillForm.title,
      icon: skillForm.icon,
      side: skillForm.side,
      skills: skillForm.skillsList.split(',').map(s => {
        const parts = s.split(':');
        return {
          name: parts[0]?.trim() || '',
          icon: parts[1]?.trim() || 'Code2'
        };
      }).filter(s => s.name)
    };

    const isEdit = !!skillForm._id;
    const url = isEdit 
      ? `${API_URL}/api/skills/${skillForm._id}` 
      : `${API_URL}/api/skills`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        showMsg(isEdit ? 'Skill category updated!' : 'Skill category created!');
        setSkillForm({ _id: '', title: '', icon: 'Layers', side: 'left', skillsList: '' });
        fetchData(token);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Skills save failed');
      }
    } catch (err: any) {
      showMsg(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!window.confirm('Delete this skills category?')) return;
    try {
      const res = await fetch(`${API_URL}/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showMsg('Skills category deleted');
        fetchData(token);
      }
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  // 5. Change Password Handler
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMsg('New passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password update failed');

      showMsg('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showMsg(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050208] text-white flex flex-col">
      {/* Header bar */}
      <header className="border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#d946ef]" size={20} />
          <span className="font-sans font-black uppercase tracking-wider text-sm sm:text-base">
            Admin <span className="text-[#d946ef]">Console</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="text-slate-400 hover:text-white text-xs font-mono transition-colors uppercase tracking-wider hidden sm:block"
          >
            Visit Live Site
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          {[
            { id: 'hero', label: 'Hero Section', icon: <FileText size={18} /> },
            { id: 'projects', label: 'Projects Manager', icon: <Code size={18} /> },
            { id: 'companies', label: 'Companies Showcase', icon: <Briefcase size={18} /> },
            { id: 'skills', label: 'Skills Grid', icon: <Award size={18} /> },
            { id: 'password', label: 'Account Settings', icon: <Settings size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMsg({ text: '', type: '' }); }}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-semibold uppercase tracking-wider transition-all text-left
                ${activeTab === tab.id 
                  ? 'bg-[#d946ef]/10 border-[#d946ef]/30 text-[#d946ef]' 
                  : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-white/10 hover:text-white'
                }
              `}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </aside>

        {/* Editor Container */}
        <main className="lg:col-span-9 space-y-6">
          {/* Notifications banner */}
          {msg.text && (
            <div className={`flex items-center gap-2.5 p-4 rounded-2xl border text-sm font-medium animate-fade-in
              ${msg.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-green-500/10 border-green-500/20 text-green-400'
              }
            `}>
              {msg.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
              <span>{msg.text}</span>
            </div>
          )}

          {/* 1. HERO TAB */}
          {activeTab === 'hero' && (
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-2">
                <FileText className="text-[#d946ef]" /> Edit Hero Landing Page
              </h2>
              <form onSubmit={handleHeroSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Greeting Text</label>
                    <input 
                      type="text" 
                      value={heroData.greeting}
                      onChange={e => setHeroData({...heroData, greeting: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Name (Solid Title)</label>
                    <input 
                      type="text" 
                      value={heroData.name}
                      onChange={e => setHeroData({...heroData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Sub-Title / Professional Focus</label>
                  <input 
                    type="text" 
                    value={heroData.subtitle}
                    onChange={e => setHeroData({...heroData, subtitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Intro Description</label>
                  <textarea 
                    rows={4}
                    value={heroData.description}
                    onChange={e => setHeroData({...heroData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Resume Link (Google Drive / PDF)</label>
                    <input 
                      type="text" 
                      value={heroData.resumeLink}
                      onChange={e => setHeroData({...heroData, resumeLink: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">LinkedIn Profile Link</label>
                    <input 
                      type="text" 
                      value={heroData.linkedinLink}
                      onChange={e => setHeroData({...heroData, linkedinLink: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">GitHub Profile Link</label>
                    <input 
                      type="text" 
                      value={heroData.githubLink}
                      onChange={e => setHeroData({...heroData, githubLink: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Instagram Profile Link</label>
                    <input 
                      type="text" 
                      value={heroData.instagramLink}
                      onChange={e => setHeroData({...heroData, instagramLink: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="openForProjects"
                    checked={heroData.openForProjects}
                    onChange={e => setHeroData({...heroData, openForProjects: e.target.checked})}
                    className="w-4 h-4 accent-[#d946ef] rounded"
                  />
                  <label htmlFor="openForProjects" className="text-sm font-semibold text-slate-300 select-none">
                    Show "Open for new projects" Badge on Home
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-[#d946ef] hover:text-white transition-colors flex items-center gap-2"
                >
                  <Save size={14} /> {loading ? 'Saving...' : 'Save Text Edits'}
                </button>
              </form>
            </div>
          )}

          {/* 2. PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fade-in">
              {/* Form */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-2 text-white">
                  <Code className="text-[#d946ef]" /> {projectForm._id ? 'Modify Project Entry' : 'Create New Project'}
                </h2>
                <form onSubmit={handleProjectSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Project Title</label>
                      <input 
                        type="text" 
                        required
                        value={projectForm.title}
                        onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Project Category (e.g. Mobile App, SaaS)</label>
                      <input 
                        type="text" 
                        required
                        value={projectForm.category}
                        onChange={e => setProjectForm({...projectForm, category: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Description</label>
                    <textarea 
                      rows={3}
                      required
                      value={projectForm.description}
                      onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Technologies (Comma separated: React, Node.js, MDB)</label>
                    <input 
                      type="text" 
                      required
                      value={projectForm.technologies}
                      onChange={e => setProjectForm({...projectForm, technologies: e.target.value})}
                      placeholder="e.g. Flutter, Dart, Firebase"
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Live Demo URL</label>
                      <input 
                        type="text" 
                        value={projectForm.demoLink}
                        onChange={e => setProjectForm({...projectForm, demoLink: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">GitHub Repo URL</label>
                      <input 
                        type="text" 
                        value={projectForm.githubLink}
                        onChange={e => setProjectForm({...projectForm, githubLink: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                    </div>
                  </div>

                  {/* Image/Logo upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Fallback Image Cover (Optional for iframes)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="text" 
                        value={projectForm.image}
                        onChange={e => setProjectForm({...projectForm, image: e.target.value})}
                        placeholder="Path to image (or upload below)"
                        className="flex-1 px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                      <label className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors">
                        <Upload size={14} /> Upload Logo
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={e => handleFileUpload(e, 'project')}
                        />
                      </label>
                    </div>
                    {projectForm.image && (
                      <div className="mt-2 w-32 aspect-video border border-white/5 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                        <img src={projectForm.image.startsWith('/uploads') ? `${API_URL}${projectForm.image}` : projectForm.image} className="object-contain w-full h-full" alt="Preview" />
                      </div>
                    )}
                  </div>

                  {/* Hide Project checkbox */}
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="isHidden"
                      checked={projectForm.isHidden}
                      onChange={e => setProjectForm({...projectForm, isHidden: e.target.checked})}
                      className="w-4 h-4 accent-[#d946ef] rounded"
                    />
                    <label htmlFor="isHidden" className="text-sm font-semibold text-slate-300 select-none">
                      Hide Project from Landing Page
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-[#d946ef] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Plus size={14} /> {loading ? 'Saving...' : projectForm._id ? 'Update Project' : 'Create Project'}
                    </button>
                    {projectForm._id && (
                      <button
                        type="button"
                        onClick={() => setProjectForm({ _id: '', title: '', category: '', description: '', technologies: '', githubLink: '', demoLink: '', image: '', isHidden: false })}
                        className="px-6 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
                <h3 className="text-lg font-bold uppercase mb-6">Existing Works Archive</h3>
                <div className="space-y-4">
                  {projects.map((proj: any) => (
                    <div key={proj._id} className="flex justify-between items-center p-4 rounded-2xl border border-white/5 bg-black/20 hover:border-white/10 transition-colors">
                      <div>
                        <h4 className="font-bold text-white text-base flex items-center gap-2">
                          {proj.title}
                          {proj.isHidden && (
                            <span className="px-2 py-0.5 rounded text-[8px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest">
                              Hidden
                            </span>
                          )}
                        </h4>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{proj.category}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setProjectForm({
                            _id: proj._id,
                            title: proj.title,
                            category: proj.category,
                            description: proj.description,
                            technologies: proj.technologies.join(', '),
                            githubLink: proj.githubLink,
                            demoLink: proj.demoLink,
                            image: proj.image || '',
                            isHidden: proj.isHidden || false
                          })}
                          className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-[#d946ef]/20 hover:text-[#d946ef] hover:border-[#d946ef]/20 transition-all"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteProject(proj._id)}
                          className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/20 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && <p className="text-slate-500 text-xs italic">No projects found. Add one above.</p>}
                </div>
              </div>
            </div>
          )}

          {/* 3. COMPANIES TAB */}
          {activeTab === 'companies' && (
            <div className="space-y-6 animate-fade-in">
              {/* Form */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-2 text-white">
                  <Briefcase className="text-[#d946ef]" /> {companyForm._id ? 'Edit Company Association' : 'Add New Company'}
                </h2>
                <form onSubmit={handleCompanySubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Company Name</label>
                      <input 
                        type="text" 
                        required
                        value={companyForm.company}
                        onChange={e => setCompanyForm({...companyForm, company: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Badge/Classification (e.g. Industry Projects)</label>
                      <input 
                        type="text" 
                        required
                        value={companyForm.badge}
                        onChange={e => setCompanyForm({...companyForm, badge: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Role Title (e.g. Project Developer)</label>
                      <input 
                        type="text" 
                        required
                        value={companyForm.role}
                        onChange={e => setCompanyForm({...companyForm, role: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Timeline / Selection Status</label>
                      <input 
                        type="text" 
                        required
                        value={companyForm.timeline}
                        onChange={e => setCompanyForm({...companyForm, timeline: e.target.value})}
                        placeholder="e.g. Practical Experience, Selection Merit"
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Description</label>
                    <textarea 
                      rows={3}
                      required
                      value={companyForm.description}
                      onChange={e => setCompanyForm({...companyForm, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Highlights / Tags (Comma separated: Full-Stack, AI Integrations)</label>
                    <input 
                      type="text" 
                      required
                      value={companyForm.highlights}
                      onChange={e => setCompanyForm({...companyForm, highlights: e.target.value})}
                      placeholder="e.g. Technical Aptitude, Industry-grade"
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                    />
                  </div>

                  {/* Logo upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Company Logo</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="text" 
                        required
                        value={companyForm.logo}
                        onChange={e => setCompanyForm({...companyForm, logo: e.target.value})}
                        placeholder="Path to logo image (or upload below)"
                        className="flex-1 px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                      <label className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors">
                        <Upload size={14} /> Upload Logo
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={e => handleFileUpload(e, 'company')}
                        />
                      </label>
                    </div>
                    {companyForm.logo && (
                      <div className="mt-2 w-16 h-16 rounded-xl border border-white/5 overflow-hidden bg-black/40 flex items-center justify-center p-2">
                        <img src={companyForm.logo.startsWith('/uploads') ? `${API_URL}${companyForm.logo}` : companyForm.logo} className="object-contain w-full h-full" alt="Preview" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-[#d946ef] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Plus size={14} /> {loading ? 'Saving...' : companyForm._id ? 'Update Company' : 'Add Company'}
                    </button>
                    {companyForm._id && (
                      <button
                        type="button"
                        onClick={() => setCompanyForm({
                          _id: '', company: '', logo: '', badge: '', role: '', timeline: '', description: '', highlights: '',
                          color: 'from-[#d946ef]/5 to-[#8b1ff5]/5', borderColor: 'hover:border-[#d946ef]/40', glowColor: 'bg-[#d946ef]/5'
                        })}
                        className="px-6 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
                <h3 className="text-lg font-bold uppercase mb-6">Affiliated Organizations</h3>
                <div className="space-y-4">
                  {companies.map((comp: any) => (
                    <div key={comp._id} className="flex justify-between items-center p-4 rounded-2xl border border-white/5 bg-black/20 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/5 p-1.5 flex items-center justify-center overflow-hidden">
                          <img src={comp.logo.startsWith('/uploads') ? `${API_URL}${comp.logo}` : comp.logo} className="object-contain w-full h-full" alt="" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{comp.company}</h4>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{comp.role}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCompanyForm({
                            _id: comp._id,
                            company: comp.company,
                            logo: comp.logo,
                            badge: comp.badge,
                            role: comp.role,
                            timeline: comp.timeline,
                            description: comp.description,
                            highlights: comp.highlights.join(', '),
                            color: comp.color,
                            borderColor: comp.borderColor,
                            glowColor: comp.glowColor
                          })}
                          className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-[#d946ef]/20 hover:text-[#d946ef] hover:border-[#d946ef]/20 transition-all"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteCompany(comp._id)}
                          className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/20 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {companies.length === 0 && <p className="text-slate-500 text-xs italic">No companies found. Add one above.</p>}
                </div>
              </div>
            </div>
          )}

          {/* 4. SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6 animate-fade-in">
              {/* Form */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-2 text-white">
                  <Award className="text-[#d946ef]" /> {skillForm._id ? 'Edit Skill Category' : 'Create New Skill Category'}
                </h2>
                <form onSubmit={handleSkillSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Category Title (e.g. Frontend, Backend)</label>
                      <input 
                        type="text" 
                        required
                        value={skillForm.title}
                        onChange={e => setSkillForm({...skillForm, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Category Lucide Icon Name (e.g. Layers, Database)</label>
                      <input 
                        type="text" 
                        required
                        value={skillForm.icon}
                        onChange={e => setSkillForm({...skillForm, icon: e.target.value})}
                        placeholder="e.g. Layers, Database, Smartphone, GitBranch"
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Timeline / Category Alignment Side</label>
                    <select
                      value={skillForm.side}
                      onChange={e => setSkillForm({...skillForm, side: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30 text-white"
                    >
                      <option value="left" className="bg-[#050208]">Left Alignment (Odd Rows)</option>
                      <option value="right" className="bg-[#050208]">Right Alignment (Even Rows)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Skills list (Format as "SkillName:IconName" separated by commas)</label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="React:Cpu, TypeScript:Code2, Next.js:Globe, Tailwind:Layers"
                      value={skillForm.skillsList}
                      onChange={e => setSkillForm({...skillForm, skillsList: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm placeholder-slate-600 focus:outline-none focus:border-[#d946ef]/30 font-mono"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-[#d946ef] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Plus size={14} /> {loading ? 'Saving...' : skillForm._id ? 'Update Category' : 'Create Category'}
                    </button>
                    {skillForm._id && (
                      <button
                        type="button"
                        onClick={() => setSkillForm({ _id: '', title: '', icon: 'Layers', side: 'left', skillsList: '' })}
                        className="px-6 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
                <h3 className="text-lg font-bold uppercase mb-6">Expertise Categories</h3>
                <div className="space-y-4">
                  {skills.map((sCat: any) => (
                    <div key={sCat._id} className="flex justify-between items-center p-4 rounded-2xl border border-white/5 bg-black/20 hover:border-white/10 transition-colors">
                      <div>
                        <h4 className="font-bold text-white text-base">{sCat.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Skills: {sCat.skills.map((s: any) => `${s.name} (${s.icon})`).join(', ')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSkillForm({
                            _id: sCat._id,
                            title: sCat.title,
                            icon: sCat.icon,
                            side: sCat.side,
                            skillsList: sCat.skills.map((s: any) => `${s.name}:${s.icon}`).join(', ')
                          })}
                          className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-[#d946ef]/20 hover:text-[#d946ef] hover:border-[#d946ef]/20 transition-all"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteSkill(sCat._id)}
                          className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/20 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {skills.length === 0 && <p className="text-slate-500 text-xs italic">No skills categories found. Add one above.</p>}
                </div>
              </div>
            </div>
          )}

          {/* 5. PASSWORD TAB */}
          {activeTab === 'password' && (
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-2">
                <Settings className="text-[#d946ef]" /> Change Admin Password
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 text-sm focus:outline-none focus:border-[#d946ef]/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-[#d946ef] hover:text-white transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  {loading ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
