import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import logoImg from '../assets/logo.png';
import {
  Lock,
  Mail,
  User,
  X,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Target,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const EXAM_PRESETS = [
  { id: 'upsc_cse', label: 'UPSC Civil Services (IAS / IPS / IFS)' },
  { id: 'ssc_cgl', label: 'SSC CGL (Central Ministries & Income Tax)' },
  { id: 'ibps_po', label: 'Banking & Financial (IBPS / SBI PO)' },
  { id: 'gate_cse', label: 'GATE CSE / PSU Tech Officer' },
  { id: 'nda_cds', label: 'Defence Services (UPSC CDS / NDA)' },
  { id: 'state_psc', label: 'State Administrative PSC' }
];

export const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const { login, register, showToast } = useApp();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regExamId, setRegExamId] = useState('upsc_cse');
  const [regEducation, setRegEducation] = useState('Bachelor Degree (Final Year / Graduate)');
  const [regDailyHours, setRegDailyHours] = useState(4);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleTabSwitch = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      showToast('Welcome back! Successfully signed in.', 'success');
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!regEmail.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    const selectedExam = EXAM_PRESETS.find((e) => e.id === regExamId);

    setIsLoading(true);
    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        targetExamId: regExamId,
        targetGoal: selectedExam ? selectedExam.label : 'National Competitive Exams',
        degreeOrStream: regEducation,
        dailyHours: Number(regDailyHours)
      });
      showToast('Account created & stored in MongoDB successfully!', 'success');
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 my-8 max-h-[92vh] overflow-y-auto relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/25 border-2 border-amber-400 mx-auto bg-white/10 p-0.5 flex items-center justify-center">
            <img
              src={logoImg}
              alt="PragyaPath Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Sign in to PragyaPath' : 'Create Free Student Account'}
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {mode === 'login'
              ? 'Access your personalized study roadmaps, saved notes, mock test history & AI mentor.'
              : 'Join with your target competitive exam and synchronize your progress directly with MongoDB.'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex rounded-xl bg-slate-950/80 p-1 text-xs font-semibold border border-white/10">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start space-x-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-800/90 text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-800/90 text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 border border-amber-300"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-800/90 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-800/90 text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Password <span className="text-slate-400 font-normal">(min 6 characters)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-800/90 text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>Target Exam / Goal</span>
                </label>
                <select
                  value={regExamId}
                  onChange={(e) => setRegExamId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-800/90 text-white"
                >
                  {EXAM_PRESETS.map((exam) => (
                    <option key={exam.id} value={exam.id} className="bg-slate-900 text-white">
                      {exam.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Academic Stage</span>
                </label>
                <select
                  value={regEducation}
                  onChange={(e) => setRegEducation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-800/90 text-white"
                >
                  <option value="Higher Secondary (11th / 12th Class)" className="bg-slate-900 text-white">Higher Secondary (11th / 12th)</option>
                  <option value="Undergraduate Degree (Year 1 - 3)" className="bg-slate-900 text-white">Undergraduate Degree (Year 1 - 3)</option>
                  <option value="Bachelor Degree (Final Year / Graduate)" className="bg-slate-900 text-white">Bachelor Degree (Final Year / Graduate)</option>
                  <option value="Postgraduate / Master Degree" className="bg-slate-900 text-white">Postgraduate / Master Degree</option>
                  <option value="Working Professional Aspirant" className="bg-slate-900 text-white">Working Professional Aspirant</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 border border-amber-300"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Student Account</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
