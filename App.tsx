import React, { useState, useCallback, useEffect, FormEvent, useRef } from 'react';
import type { Participant } from './types';

// Let TypeScript know about the global emailjs object on the window
declare global {
  interface Window {
    emailjs: any; 
  }
}

// --- EMAILJS CONFIGURATION ---
const SERVICE_ID = 'service_ovdobb4';
const TEMPLATE_ID = 'template_xnq4n3r'; // Auth Template
const PUBLIC_KEY = 'DISO7k-Ev9xWIMk0J';

const initialParticipants: Participant[] = [
  { id: -1, name: 'Project Victoria For Art', avatarUrl: '', statuses: ['Administrator', 'Developer'] },
  { id: -2, name: 'Victoria Arts Council', avatarUrl: '', statuses: ['Collaborator'], link: 'https://artsvictoria.ca' },
  { id: -3, name: 'Liam Smith', avatarUrl: '', statuses: ['Opted-in'] },
  { id: -4, name: 'Olivia Johnson', avatarUrl: '', statuses: ['Opted-in'] },
  { id: -5, name: 'Noah Williams', avatarUrl: '', statuses: ['Opted-in'] },
  { id: -6, name: 'Emma Brown', avatarUrl: '', statuses: ['Opted-in'] },
  { id: -7, name: 'Oliver Jones', avatarUrl: '', statuses: ['Opted-in'] },
  { id: -8, name: 'Ava Garcia', avatarUrl: '', statuses: ['Opted-in'] },
];

// --- SVG ICON COMPONENTS ---
const PaintBrushIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

const PeopleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 18C17 15.7909 14.7614 14 12 14C9.23858 14 7 15.7909 7 18" />
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" />
    <path d="M21 17C21 15.3431 19.6569 14 18 14C17.4118 14 16.8655 14.1593 16.3881 14.4332" />
    <path d="M18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C17.202 5 16.4855 5.35201 16 5.9056" />
    <path d="M3 17C3 15.3431 4.34315 14 6 14C6.58821 14 7.13452 14.1593 7.61189 14.4332" />
    <path d="M6 11C4.34315 11 3 9.65685 3 8C3 6.34315 4.34315 5 6 5C6.79799 5 7.5145 5.35201 8 5.9056" />
  </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2V3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V22" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.93 3.93L4.64 4.64" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.36 19.36L20.07 20.07" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 12H21" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12H2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.36 4.64L20.07 3.93" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.93 20.07L4.64 19.36" />
    </svg>
);


const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckBadgeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" opacity="0" />
    <path d="M12 22C9.224 22 6.785 20.84 5 18.998c-1.401-1.401-2-3.29-2-5.186 0-1.895.599-3.785 2-5.186C6.785 6.16 9.224 5 12 5c2.776 0 5.215 1.16 7 3.002 1.401 1.401 2 3.291 2 5.186 0 1.896-.599 3.785-2 5.186C17.215 20.84 14.776 22 12 22zM12 2v20" />
    <path d="M5 18.998C6.753 15.823 8.948 14 12 14c3.052 0 5.247 1.823 7 4.998M5 8.002C6.753 11.177 8.948 13 12 13c3.052 0 5.247-1.823 7-4.998" />
  </svg>
);


// --- UI COMPONENTS ---
interface HeaderProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onLogoClick: () => void;
  isLoggedIn: boolean;
  onLogoutClick: () => void;
  currentUser: Participant | null;
}
const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignUpClick, onLogoClick, isLoggedIn, onLogoutClick, currentUser }) => {
  const getFirstName = (name: string | undefined): string => {
    if (!name) return '';
    const firstName = name.split(' ')[0];
    // Capitalize the first letter and make the rest lowercase for consistency
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-md z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div onClick={onLogoClick} className="text-2xl font-bold text-gray-800 cursor-pointer">
          <span className="text-green-600">Vic</span>Mural
        </div>
        <div className="space-x-2 sm:space-x-4 flex items-center flex-nowrap">
            {isLoggedIn ? (
                <>
                    <span className="text-gray-700 font-medium">Welcome, {getFirstName(currentUser?.name)}!</span>
                    <button onClick={onLogoutClick} className="text-gray-600 hover:text-green-600 transition-colors duration-300">Log Out</button>
                </>
            ) : (
                <>
                    <button onClick={onLoginClick} className="text-gray-600 hover:text-green-600 transition-colors duration-300">Log In</button>
                    <button onClick={onSignUpClick} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Sign Up
                    </button>
                </>
            )}
        </div>
      </nav>
    </header>
  );
};

interface HeroProps {
  onSignUpClick: () => void;
}
const Hero: React.FC<HeroProps> = ({ onSignUpClick }) => {
  return (
    <section className="relative h-screen flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/muralart/1920/1080')" }}></div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg">Paint Our City's Canvas</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200 drop-shadow-md">Join the Victoria Community Mural Movement and leave your artistic mark on the streets we call home. Collaborate, create, and inspire.</p>
        <button onClick={onSignUpClick} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
          Join the Movement
        </button>
      </div>
    </section>
  );
};

const ProjectDescription: React.FC = () => {
  const features = [
    { icon: <PaintBrushIcon className="h-12 w-12 text-green-500" />, title: "Shape Our Art", description: "Your voice shapes our art. Vote on mural themes, collaborate on designs, and help choose the next masterpiece." },
    { icon: <PeopleIcon className="h-12 w-12 text-green-500" />, title: "Build Community", description: "Connect with fellow artists, residents, and businesses who share a passion for a more vibrant Victoria." },
    { icon: <SunIcon className="h-12 w-12 text-green-500" />, title: "Brighten Victoria", description: "Transform dull walls into vibrant canvases that reflect our city's culture and collective creativity." },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">A Movement for Public Art</h2>
        <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">We believe public art is the heartbeat of a city. This movement empowers local artists and residents to share their stories and add color to our shared spaces.</p>
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-green-100 p-6 rounded-full mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CommunityVoice: React.FC = () => {
    return (
        <section id="voice" className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Everyone Gets A Voice</h2>
                <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
                    This is more than just art; it's a conversation. As a member, your input directly shapes the future of Victoria's streets.
                </p>
                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-center mb-4">
                            <CheckBadgeIcon className="h-12 w-12 text-green-500"/>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Weekly Mural Polls</h3>
                        <p className="text-gray-600">
                            Every week, members get to vote on a selection of new mural proposals. Your vote directly decides what art comes to life.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-center mb-4">
                             <BrainIcon className="h-12 w-12 text-green-500"/>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Creative Idea Hub</h3>
                        <p className="text-gray-600">
                           Have an idea for a mural or a wall that needs some love? Our community forum is the place to share insights and collaborate with artists.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface ParticipantListProps {
    participants: Participant[];
}
const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  const participantCap = 500;

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: { [key: string]: string } = {
      'Administrator': 'bg-red-100 text-red-800',
      'Collaborator': 'bg-amber-100 text-amber-800',
      'Opted-in': 'bg-green-100 text-green-800',
      'Developer': 'bg-slate-100 text-slate-800',
    };
    const defaultStyle = 'bg-gray-100 text-gray-800';
    const style = styles[status] || defaultStyle;

    return (
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${style}`}>
        {status}
      </span>
    );
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Our Community Members</h2>
            <p className="text-lg text-gray-600 mt-2 font-semibold">
                <span className="text-green-600">{participants.length}</span> / {participantCap} Participants
            </p>
        </div>
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
             <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {participants.length > 0 ? participants.map(p => (
                <li key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <span className="text-gray-800 font-medium truncate">{p.name}</span>
                  <div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                    {p.link && (
                      <a 
                        href={p.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200 hover:bg-sky-200 transition-colors underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        artsvictoria.ca
                      </a>
                    )}
                    {p.statuses.map(status => <StatusBadge key={status} status={status} />)}
                  </div>
                </li>
              )) : (
                <li className="px-6 py-10 text-center text-gray-500">
                    Be the first to join the movement!
                </li>
              )}
            </ul>
        </div>
      </div>
    </section>
  );
};

interface FooterProps {
    variant: 'slim' | 'full';
    onCopyrightClick: () => void;
    onPrivacyClick: () => void;
    onTermsClick: () => void;
    onContactClick: () => void;
}
const Footer: React.FC<FooterProps> = ({ variant, onCopyrightClick, onPrivacyClick, onTermsClick, onContactClick }) => {
  const listClasses = variant === 'slim'
    ? "mt-2 space-y-2 max-h-0 overflow-hidden group-hover:max-h-96 transition-all duration-500 ease-in-out"
    : "mt-4 space-y-2";
    
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-6 md:gap-8">
            <div className="flex-shrink-0">
                <h2 className="text-2xl font-bold">
                  <span className="text-green-500">Vic</span>Mural
                </h2>
                <p className="text-gray-400 mt-2">Painting our city's canvas, together.</p>
            </div>
          
            <div className="flex flex-row gap-8 sm:gap-16">
                <div className={variant === 'slim' ? 'group' : ''}>
                    <h3 className="font-semibold uppercase tracking-wider">Legal</h3>
                    <ul className={listClasses}>
                        <li><button onClick={onCopyrightClick} className="text-gray-400 hover:text-white transition-colors">Copyright</button></li>
                        <li><button onClick={onPrivacyClick} className="text-gray-400 hover:text-white transition-colors">Privacy Policy</button></li>
                        <li><button onClick={onTermsClick} className="text-gray-400 hover:text-white transition-colors">Terms of Use</button></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Licensing Agreements</a></li>
                    </ul>
                </div>
                <div className={variant === 'slim' ? 'group' : ''}>
                    <h3 className="font-semibold uppercase tracking-wider">Contact</h3>
                    <ul className={listClasses}>
                        <li><button onClick={onContactClick} className="text-gray-400 hover:text-white transition-colors">Contact Us</button></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Feedback</a></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <hr className="my-6 md:my-8 border-gray-700" />
        
        <div className="text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Victoria Community Mural Movement. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 id="modal-title" className="text-2xl font-bold text-center text-gray-800 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

interface LoginFormProps {
    onSubmit: (email: string, password: string) => boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        const success = onSubmit(email, password);
        if (!success) {
            setError('Invalid credentials. Please check your email and try again.');
        }
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="login-email">Email Address</label>
                <input
                    id="login-email"
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-105">
                Log In
            </button>
        </form>
    );
};

interface SignUpFormProps {
    onSubmit: (name: string, email: string) => void;
    isSubmitting: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isSubmitting }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(name, email);
    }
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="signup-name">Full Name</label>
        <input 
            id="signup-name" 
            type="text" 
            required
            placeholder="Jane Doe"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="signup-email">Email Address</label>
        <input 
            id="signup-email" 
            type="email" 
            required 
            placeholder="example@gmail.com" 
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="signup-password">Password</label>
        <input id="signup-password" type="password" required placeholder="••••••••" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500" />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
        {isSubmitting ? 'Sending Code...' : 'Create Account & Join'}
      </button>
    </form>
  );
};

interface VerificationFormProps {
    email: string;
    onSubmit: (code: string) => void;
    onBack: () => void;
    isVerifying: boolean;
    error: string | null;
}
const VerificationForm: React.FC<VerificationFormProps> = ({ email, onSubmit, onBack, isVerifying, error }) => {
    const [code, setCode] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(code);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <p className="text-center text-gray-600">
                We've sent a 6-digit verification code to <strong className="text-gray-800">{email}</strong>. Please enter it below to complete your registration.
            </p>
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="verification-code">Verification Code</label>
                <input
                    id="verification-code"
                    type="text"
                    required
                    maxLength={6}
                    className="mt-1 block w-full text-center tracking-[1em] text-2xl font-bold px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
                    placeholder="------"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </div>
             {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button
                type="submit"
                disabled={isVerifying || code.length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isVerifying ? 'Verifying...' : 'Verify & Complete Signup'}
            </button>
            <div className="text-center">
                <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                    Entered the wrong email? Go back.
                </button>
            </div>
        </form>
    );
};

interface SignUpPageProps {
    onInitiateSignUp: (name: string, email: string) => void;
    onCompleteSignUp: (code: string) => void;
    onBackToDetails: () => void;
    signupStep: 'details' | 'verify';
    verificationEmail: string | null;
    isSigningUp: boolean;
    verificationError: string | null;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onInitiateSignUp, onCompleteSignUp, onBackToDetails, signupStep, verificationEmail, isSigningUp, verificationError }) => {
  const backgroundImageUrl = 'https://www.thisiscolossal.com/wp-content/uploads/2018/11/louise-chen-2-960x656.jpg';

  return (
    <main className="relative pt-40 pb-24 flex justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      ></div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 container mx-auto px-4 flex justify-center items-start">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 md:p-12">
          {signupStep === 'details' ? (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Your Artist Profile</h2>
              <p className="text-center text-gray-500 mb-8">Join our movement and help paint the town!</p>
              <SignUpForm onSubmit={onInitiateSignUp} isSubmitting={isSigningUp} />
            </>
          ) : (
             <>
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Check Your Email</h2>
              <p className="text-center text-gray-500 mb-8">Step 2 of 2: Email Verification</p>
              {verificationEmail && 
                <VerificationForm 
                    email={verificationEmail} 
                    onSubmit={onCompleteSignUp}
                    onBack={onBackToDetails}
                    isVerifying={isSigningUp}
                    error={verificationError}
                />}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

interface HomePageProps {
  onSignUpClick: () => void;
  participants: Participant[];
}
const HomePage: React.FC<HomePageProps> = ({ onSignUpClick, participants }) => {
  return (
    <main>
      <Hero onSignUpClick={onSignUpClick} />
      <ProjectDescription />
      <CommunityVoice />
      <ParticipantList participants={participants} />
    </main>
  );
};

const CustomerServicePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [formData, setFormData] = useState({ from_name: '', from_email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');

        const CONTACT_TEMPLATE_ID = 'template_2ewe2ax';

        // The formData object ({ from_name, from_email, message })
        // directly matches the expected variables in a standard contact template.
        window.emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, formData)
            .then(() => {
                setStatus('success');
                setFormData({ from_name: '', from_email: '', message: '' });
                setTimeout(() => {
                    onClose();
                }, 2500);
            }, (error: any) => {
                setStatus('error');
                console.error('EmailJS failed to send:', error.text);
            });
    };

    return (
        <div>
            {status === 'success' ? (
                <div className="text-center py-8">
                    <CheckBadgeIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">Message Sent!</h3>
                    <p className="text-gray-500 mt-2">Thanks for reaching out. We'll get back to you soon.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="from_name" className="block text-sm font-medium text-gray-700">Your Name</label>
                        <input
                            type="text"
                            name="from_name"
                            id="from_name"
                            required
                            placeholder="Jane Doe"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
                            value={formData.from_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="from_email" className="block text-sm font-medium text-gray-700">Your Email</label>
                        <input
                            type="email"
                            name="from_email"
                            id="from_email"
                            required
                            placeholder="you@example.com"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
                            value={formData.from_email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            name="message"
                            id="message"
                            rows={4}
                            required
                            placeholder="How can we help?"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
                            value={formData.message}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                    {status === 'error' && (
                        <p className="text-center text-sm text-red-600 mt-2">
                            Oops! Something went wrong. Please try again later.
                        </p>
                    )}
                </form>
            )}
        </div>
    );
};

// --- Profanity Filter ---
const profanityList = ['darn', 'heck', 'shoot']; // A simple, SFW list for example
const profanityFilter = (text: string): string => {
    let cleanText = text;
    profanityList.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        cleanText = cleanText.replace(regex, '*'.repeat(word.length));
    });
    return cleanText;
}


// --- MAIN APP COMPONENT ---
export default function App() {
  const [modal, setModal] = useState<{ type: 'login' | 'info' | 'contact'; title: string; children: React.ReactNode } | null>(null);
  const [page, setPage] = useState<'home' | 'signup'>('home');
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
        const savedUserParticipantsRaw = localStorage.getItem('vcmm-participants');
        if (savedUserParticipantsRaw) {
            const userAddedParticipants = JSON.parse(savedUserParticipantsRaw) as Participant[];
            // Combine the hardcoded initial list with the user-added list from storage
            return [...initialParticipants, ...userAddedParticipants];
        }
    } catch (error) {
        console.error("Failed to load participants from localStorage", error);
    }
    // If nothing is in storage, start with the initial list
    return initialParticipants;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);

  // State for the two-step signup process
  const [signupStep, setSignupStep] = useState<'details' | 'verify'>('details');
  const [signupData, setSignupData] = useState<{ name: string; email: string; } | null>(null);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Save only user-added participants to localStorage whenever they change
  useEffect(() => {
    try {
        const userAddedParticipants = participants.filter(p => p.id > 0);
        localStorage.setItem('vcmm-participants', JSON.stringify(userAddedParticipants));
    } catch (error) {
        console.error("Failed to save participants to localStorage", error);
    }
  }, [participants]);


  const closeModal = useCallback(() => setModal(null), []);

  const openInfoModal = useCallback((title: string, content: React.ReactNode) => {
    setModal({ type: 'info', title, children: content });
  }, []);

  const openContactModal = useCallback(() => {
    setModal({
        type: 'contact',
        title: 'Contact Us',
        children: <CustomerServicePage onClose={closeModal} />
    });
  }, [closeModal]);

  const resetSignupState = () => {
    setSignupStep('details');
    setSignupData(null);
    setVerificationCode(null);
    setVerificationError(null);
    setIsSigningUp(false);
  };
  
  const navigateToSignUp = useCallback(() => {
    resetSignupState();
    setPage('signup');
    window.scrollTo(0, 0);
  }, []);

  const navigateToHome = useCallback(() => {
    resetSignupState();
    setPage('home');
    window.scrollTo(0, 0);
  }, []);
  
  const handleLogin = useCallback((email: string, password: string): boolean => {
    // NOTE: We are not checking the password for this demo app.
    // In a real application, you would send this to a backend for secure verification.
    const user = participants.find(p => p.email?.toLowerCase() === email.toLowerCase());
    
    if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        closeModal();
        navigateToHome();
        return true;
    }
    
    return false;
  }, [participants, closeModal, navigateToHome]);

  const openLoginModal = useCallback(() => setModal({ type: 'login', title: 'Log In', children: <LoginForm onSubmit={handleLogin}/> }), [handleLogin]);

  const handleSignUpInitiation = async (name: string, email: string) => {
    if (!name.trim() || !email.trim()) return;
    setIsSigningUp(true);
    setVerificationError(null);

    const passcode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);
    const expiryTime = expiryDate.toLocaleString();
    
    setSignupData({ name, email });
    setVerificationCode(passcode);

    const templateParams = {
        to_email: email,
        from_name: 'VicMural Auth System',
        passcode: passcode,
        time: expiryTime,
    };
    
    try {
        await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
        setSignupStep('verify');
    } catch (error: any) {
        console.error("EmailJS send failed:", error);
        setVerificationError(`Failed to send verification email. ${error.text || 'Please try again.'}`);
    } finally {
        setIsSigningUp(false);
    }
  };

  const handleSignUpCompletion = (enteredCode: string) => {
    setIsSigningUp(true);
    setVerificationError(null);

    setTimeout(() => { // Simulate network latency
        if (enteredCode === verificationCode && signupData) {
            const newId = Math.max(0, ...participants.map(p => p.id)) + 1;
            const newParticipant: Participant = {
                id: newId,
                name: signupData.name,
                email: signupData.email.toLowerCase(),
                avatarUrl: `https://picsum.photos/seed/${signupData.name.replace(/\s/g, '')}/200`,
                statuses: ['Opted-in'],
            };
            
            setParticipants(prev => [...prev, newParticipant]);
            setCurrentUser(newParticipant);
            setIsLoggedIn(true);
            navigateToHome();
        } else {
            setVerificationError('Invalid code. Please check your email and try again.');
        }
        setIsSigningUp(false);
    }, 1000);
  };

  const handleBackToDetails = () => {
      setSignupStep('details');
      setVerificationError(null);
  };

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  }, []);

  useEffect(() => {
    if (window.emailjs && PUBLIC_KEY) {
        window.emailjs.init({ publicKey: PUBLIC_KEY });
    }
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [closeModal]);
  
  const copyrightContent = <div className="text-gray-600 text-sm space-y-2"><p>All content on this website, including text, graphics, logos, and images, is the property of the Victoria Community Mural Movement and is protected by international copyright laws.</p></div>;
  const privacyContent = (
    <div className="text-gray-600 text-sm text-left space-y-4 max-h-[60vh] overflow-y-auto pr-4">
        <p className="italic">Last updated: November 10, 2025</p>
        <p>Welcome to Victoria Mural. Your privacy matters to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website, mobile app, and related services (collectively, the “Service”).</p>
        <div>
            <h3 className="font-semibold text-base text-gray-800 mb-2">1. Information We Collect</h3>
            <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Personal Information</strong> – such as your name, email, and profile details when you create an account or contact us.</li>
                <li><strong>Usage Data</strong> – such as IP address, browser type, device information, and activity within the Service.</li>
            </ul>
        </div>
        <div>
            <h3 className="font-semibold text-base text-gray-800 mb-2">2. How We Use Your Information</h3>
            <p>Your information helps us to operate and maintain the Service, personalize your experience, and communicate updates.</p>
        </div>
        <div>
            <h3 className="font-semibold text-base text-gray-800 mb-2">3. Data Retention</h3>
            <p>We keep your information only as long as needed to provide the Service and meet legal obligations.</p>
        </div>
        <div>
            <h3 className="font-semibold text-base text-gray-800 mb-2">4. Your Rights</h3>
            <p>You may have the right to access, correct, or delete your personal data. To make a request, email us at project.victoria.for.art@gmail.com.</p>
        </div>
        <div>
            <h3 className="font-semibold text-base text-gray-800 mb-2">5. Contact Us</h3>
            <p>If you have any questions, please contact us at data.relay.service@gmail.com</p>
        </div>
    </div>
  );
  const termsContent = <div className="text-gray-600 text-sm space-y-2"><p>By accessing this website, you agree to be bound by these Terms of Use. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p></div>;

  const renderPage = () => {
    switch (page) {
      case 'signup':
        return <SignUpPage 
                    onInitiateSignUp={handleSignUpInitiation} 
                    onCompleteSignUp={handleSignUpCompletion}
                    onBackToDetails={handleBackToDetails}
                    signupStep={signupStep}
                    verificationEmail={signupData?.email || null}
                    isSigningUp={isSigningUp}
                    verificationError={verificationError}
                />;
      case 'home':
      default:
        return <HomePage onSignUpClick={navigateToSignUp} participants={participants} />;
    }
  };
  
  return (
    <div className="bg-white text-gray-800 flex flex-col min-h-screen">
      <Header 
        onLoginClick={openLoginModal} 
        onSignUpClick={navigateToSignUp}
        onLogoClick={navigateToHome}
        isLoggedIn={isLoggedIn}
        onLogoutClick={handleLogout}
        currentUser={currentUser}
      />
      
      <div className="flex-grow">
        {renderPage()}
      </div>

      <Footer 
        variant={page === 'signup' ? 'slim' : 'full'}
        onCopyrightClick={() => openInfoModal('Copyright Information', copyrightContent)}
        onPrivacyClick={() => openInfoModal('Privacy Policy', privacyContent)}
        onTermsClick={() => openInfoModal('Terms of Use', termsContent)}
        onContactClick={openContactModal}
      />
      
      <Modal isOpen={!!modal} onClose={closeModal} title={modal?.title ?? ''}>
        {modal?.children}
      </Modal>
    </div>
  );
}