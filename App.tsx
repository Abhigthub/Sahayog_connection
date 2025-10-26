
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/pages/LandingPage';
import FormPage from './components/pages/FormPage';
import ResultsPage from './components/pages/ResultsPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import AccountabilityPage from './components/pages/AccountabilityPage';
import ProfilePage from './components/pages/ProfilePage';
import AdminPage from './components/pages/AdminPage';
import DataPage from './components/pages/DataPage';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import ManageAdminsPage from './components/pages/ManageAdminsPage';
import Sidebar from './components/Sidebar';
import { Scheme, UserProfile, User, Application, ApplicationStatus, UserDocument, FamilyMember } from './types';
import { ALL_SCHEMES as INITIAL_SCHEMES, MOCK_USERS } from './constants';
import { findMatchingSchemeIds } from './services/geminiService';
import { authService } from './services/authService';

// --- Application Modal Component (Re-usable) ---
const ApplicationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  scheme: Scheme | null;
  userProfile: UserProfile | null;
}> = ({ isOpen, onClose, onSubmit, scheme, userProfile }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen || !scheme || !userProfile) return null;

  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  const handlePrevStep = () => setCurrentStep(prev => prev - 1);
  
  const handleSubmitClick = () => {
    setIsSubmitting(true);
    setTimeout(() => {
        onSubmit();
        setIsSubmitting(false);
        setIsSubmitted(true);
    }, 1500);
  };
  
  const renderStep = () => {
    if(isSubmitted) {
        return (
            <div className="text-center p-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-slate-800">Application Submitted!</h3>
                <p className="mt-2 text-slate-600">Your application for the "{scheme.title}" has been successfully submitted. You can track its status in your Profile.</p>
                <button onClick={onClose} className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Close</button>
            </div>
        )
    }

    switch (currentStep) {
      case 1: // Confirm Details
        return (
          <div>
            <h3 className="text-lg font-semibold">Step 1: Confirm Your Details</h3>
            <div className="mt-4 space-y-2 text-sm bg-slate-50 p-4 rounded-lg border">
              <p><strong>Age:</strong> {userProfile.age}</p>
              <p><strong>Annual Income:</strong> ₹{userProfile.annualIncome.toLocaleString('en-IN')}</p>
              <p><strong>State:</strong> {userProfile.state}</p>
              <p><strong>Category:</strong> {userProfile.category}</p>
              <p><strong>Occupation:</strong> {userProfile.occupation}</p>
            </div>
          </div>
        );
      case 2: // Upload Documents
        return (
          <div>
            <h3 className="text-lg font-semibold">Step 2: Upload Documents</h3>
            <p className="text-sm text-slate-500 mt-1">Please upload the required documents.</p>
            <div className="mt-4 p-6 border-2 border-dashed rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p className="mt-2 text-sm text-slate-600">Drag & drop files here or click to browse</p>
              <p className="text-xs text-slate-400">(This is a simulated upload)</p>
            </div>
          </div>
        );
      case 3: // Review & Submit
        return (
          <div>
            <h3 className="text-lg font-semibold">Step 3: Review & Submit</h3>
            <p className="text-sm text-slate-500 mt-1">Review your details and submit the application.</p>
            <div className="mt-4 space-y-2 text-sm bg-slate-50 p-4 rounded-lg border">
                 <p><strong>Applying for:</strong> {scheme.title}</p>
                 <p><strong>Your Details:</strong> Confirmed</p>
                 <p><strong>Documents:</strong> Ready for submission</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const totalSteps = 3;

  return (
    <div className={`fixed inset-0 bg-black/60 z-50 flex items-center justify-center transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Apply for Scheme</h2>
              <p className="text-sm text-slate-500">{scheme.title}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
          </div>
        </div>
        <div className="p-6">
          {!isSubmitted && (
             <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Step {currentStep} of {totalSteps}</span>
                    <span>{["Details", "Documents", "Submit"][currentStep - 1]}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
                </div>
            </div>
          )}
          {renderStep()}
        </div>
        {!isSubmitted && (
            <div className="px-6 py-4 bg-slate-50 rounded-b-xl border-t flex justify-between">
                <button onClick={handlePrevStep} disabled={currentStep === 1} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border rounded-lg hover:bg-slate-100 disabled:opacity-50">Back</button>
                {currentStep < totalSteps ? (
                    <button onClick={handleNextStep} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border rounded-lg hover:bg-blue-700">Next</button>
                ) : (
                    <button onClick={handleSubmitClick} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-green-600 border rounded-lg hover:bg-green-700 disabled:bg-green-400">
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};


// --- Main App Component ---
type Page = 'landing' | 'form' | 'results' | 'login' | 'register' | 'accountability' | 'dashboard';
type AdminView = 'dashboard' | 'applications' | 'manage_admins' | 'data';
type UserView = 'user'; // For clarity

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [loginInfoMessage, setLoginInfoMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentLoginRole, setCurrentLoginRole] = useState<'user' | 'admin' | null>(null);
  const [activeView, setActiveView] = useState<AdminView | UserView>('user');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publicSearchTerm, setPublicSearchTerm] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // --- Data Management State ---
  const [allSchemes, setAllSchemes] = useState<Scheme[]>(INITIAL_SCHEMES);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [applications, setApplications] = useState<Application[]>([]);
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // --- EFFECTS ---
  useEffect(() => {
    // Check for logged-in user on initial load
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      const role = sessionStorage.getItem('sahayog_connect_role') as 'user' | 'admin' | null;
      setCurrentLoginRole(role);
      // Don't auto-navigate, let the user decide where to go.
    }
  }, []);

  // --- NAVIGATION & AUTH HANDLERS ---
  const handleNavigate = (page: Page) => {
    setPublicSearchTerm('');
    setLoginInfoMessage('');
    setCurrentPage(page);
  }
  
  const handleLoginSuccess = (user: User, loginAs: 'user' | 'admin') => {
    setCurrentUser(user);
    setCurrentLoginRole(loginAs);
    setActiveView(user.role === 'admin' && loginAs === 'admin' ? 'dashboard' : 'user');
    handleNavigate('dashboard');
  }

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentLoginRole(null);
    handleNavigate('landing');
  }

  // --- CORE FUNCTIONALITY HANDLERS ---
  const handleProfileSubmit = async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setUserProfile(profile);
    setMatchedSchemes([]);
    setCurrentPage('results');
    
    try {
      const matchedIds = await findMatchingSchemeIds(profile, allSchemes);
      const filteredSchemes = allSchemes.filter(scheme => matchedIds.includes(scheme.id));
      setMatchedSchemes(filteredSchemes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublicSearch = (searchTerm: string) => {
    setPublicSearchTerm(searchTerm);
    setCurrentPage('results');
  };

  const handleApplyClick = (scheme: Scheme) => {
    if (!currentUser) {
        setLoginInfoMessage("Please log in to apply for schemes.");
        handleNavigate('login');
        return;
    }
    if (!userProfile) {
        alert("Please find your recommended schemes first to pre-fill your application details.");
        handleNavigate('form');
        return;
    }
    setSelectedScheme(scheme);
    setIsModalOpen(true);
  };
  
  const handleApplicationSubmit = () => {
    if (!currentUser || !selectedScheme || !userProfile) return;
    
    const appNumber = `SAHA-${Date.now()}`;
    const newApplication: Application = {
        id: `app_${Date.now()}`,
        applicationNumber: appNumber,
        userId: currentUser.id,
        userName: currentUser.name,
        schemeId: selectedScheme.id,
        schemeTitle: selectedScheme.title,
        status: 'Submitted',
        submittedAt: new Date(),
        userProfile: userProfile,
    };
    setApplications(prev => [...prev, newApplication]);

    const newDocument: UserDocument = {
        id: `doc_${Date.now()}`,
        name: `${selectedScheme.title} Documents`,
        applicationNumber: appNumber,
        type: 'Application Documents',
        status: 'Pending',
    };
    setUserDocuments(prev => [...prev, newDocument]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedScheme(null);
  };
  
  const handleFindSchemesClick = () => {
    if (currentUser) {
        handleNavigate('form');
    } else {
        setLoginInfoMessage("Please log in to check your eligibility.");
        handleNavigate('login');
    }
  };

  // --- DATA MUTATION HANDLERS (for profile & admin) ---
  const handleApplicationStatusChange = (appId: string, status: ApplicationStatus) => {
    setApplications(apps => apps.map(app => app.id === appId ? {...app, status} : app));
  };

  const handleDocumentStatusChange = (applicationNumber: string, status: UserDocument['status']) => {
    setUserDocuments(docs => 
      docs.map(doc => 
        doc.applicationNumber === applicationNumber ? { ...doc, status } : doc
      )
    );
  };
  
  const handleToggleBookmark = (schemeId: string) => {
    if (!currentUser) {
        setLoginInfoMessage("Please log in to save schemes.");
        handleNavigate('login');
        return;
    }

    const isBookmarked = currentUser.bookmarkedSchemeIds.includes(schemeId);
    const updatedBookmarks = isBookmarked
      ? currentUser.bookmarkedSchemeIds.filter(id => id !== schemeId)
      : [...currentUser.bookmarkedSchemeIds, schemeId];

    const updatedUser = { ...currentUser, bookmarkedSchemeIds: updatedBookmarks };
    
    setCurrentUser(updatedUser);
    authService.updateCurrentUser(updatedUser);
  };
  
  const handleAddFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMember = { ...member, id: `fam_${Date.now()}` };
    setFamilyMembers(prev => [...prev, newMember]);
  };
  
  const handleSchemeUpdate = (updatedScheme: Scheme) => {
    setAllSchemes(prevSchemes => 
      prevSchemes.map(s => s.id === updatedScheme.id ? updatedScheme : s)
    );
  };

  const handleAddAdmin = (newAdmin: User) => {
    setAllUsers(prev => [...prev, newAdmin]);
  };

  // --- RENDERING LOGIC ---
  const renderPageContent = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} infoMessage={loginInfoMessage} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'accountability':
        return <AccountabilityPage />;
      case 'form':
        if (!currentUser) { 
            handleNavigate('login');
            return null; 
        }
        return <FormPage onSubmit={handleProfileSubmit} isLoading={isLoading} />;
      case 'results':
        return <ResultsPage 
                 isLoading={isLoading} 
                 error={error} 
                 matchedSchemes={matchedSchemes}
                 allSchemes={allSchemes}
                 onApply={handleApplyClick}
                 currentUser={currentUser}
                 onToggleBookmark={handleToggleBookmark}
                 initialSearchTerm={publicSearchTerm}
               />;
      case 'dashboard':
          if (!currentUser) {
            handleNavigate('login');
            return null;
          }
          const bookmarkedSchemes = allSchemes.filter(s => currentUser.bookmarkedSchemeIds.includes(s.id));
          switch(activeView) {
              case 'user':
                  return <ProfilePage 
                            user={currentUser} 
                            applications={applications.filter(a => a.userId === currentUser.id)} 
                            bookmarkedSchemes={bookmarkedSchemes}
                            userDocuments={userDocuments.filter(d => applications.some(a => a.userId === currentUser.id && a.applicationNumber === d.applicationNumber))}
                            familyMembers={familyMembers}
                            onAddFamilyMember={handleAddFamilyMember}
                            onApply={handleApplyClick}
                            onToggleBookmark={handleToggleBookmark}
                        />;
              case 'dashboard':
                  return <AdminDashboardPage 
                          adminUser={currentUser}
                          totalUsers={allUsers.length}
                          totalSchemes={allSchemes.length}
                          applications={applications}
                         />;
              case 'applications':
                  return <AdminPage 
                          allApplications={applications} 
                          allDocuments={userDocuments}
                          onStatusChange={handleApplicationStatusChange} 
                          onDocumentStatusChange={handleDocumentStatusChange} 
                        />;
              case 'manage_admins':
                  return <ManageAdminsPage 
                          allAdmins={allUsers.filter(u => u.role === 'admin')}
                          onAddAdmin={handleAddAdmin}
                        />;
              case 'data':
                  return <DataPage allSchemes={allSchemes} onSchemeUpdate={handleSchemeUpdate} />;
              default:
                  return null;
          }

      case 'landing':
      default:
        return <LandingPage onFindSchemes={handleFindSchemesClick} onSearch={handlePublicSearch} />;
    }
  };
  
  return (
    <>
      <div className={`flex flex-col min-h-screen ${currentUser ? 'md:flex-row' : ''}`}>
        {currentUser && (
          <Sidebar 
            user={currentUser} 
            activeView={activeView as any} // Cast because activeView can be 'user'
            onViewChange={(view) => {
                setActiveView(view);
                handleNavigate('dashboard');
            }}
            currentLoginRole={currentLoginRole}
          />
        )}
        <div className="flex-grow flex flex-col">
            <Header user={currentUser} onNavigate={handleNavigate} onLogout={handleLogout} language={language} onLanguageChange={setLanguage} />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
               {renderPageContent()}
            </main>
            <Footer />
        </div>
      </div>

      <ApplicationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleApplicationSubmit}
        scheme={selectedScheme}
        userProfile={userProfile}
      />
    </>
  );
};

export default App;
