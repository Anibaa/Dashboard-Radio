import { useState } from 'preact/hooks';
import { useAuth } from './hooks/useAuth';
import { NavBar } from './components/NavBar';
import { Header } from './components/Header';
import { InstallPrompt } from './components/InstallPrompt';
import { SignInPage } from './pages/SignInPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { ChatPage } from './pages/ChatPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import type { Page } from './types/nav';

type AuthView = 'signin' | 'forgot';

export function App() {
  const { session, user, isAuthenticated, loading, signIn, signOut } = useAuth();
  const [page, setPage] = useState<Page>('dashboard');
  const [authView, setAuthView] = useState<AuthView>('signin');
  const [installBarVisible, setInstallBarVisible] = useState(false);

  // Force re-render on profile update
  const [, forceUpdate] = useState(0);
  const handleProfileUpdate = () => forceUpdate((n) => n + 1);

  const handleSignIn = async (email: string, password: string) => {
    await signIn(email, password);
    setAuthView('signin');
  };

  const handleSignOut = async () => {
    await signOut();
    setPage('dashboard');
  };

  const renderPage = () => {
    if (!user) return null;
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'map':       return <MapPage />;
      case 'chat':      return <ChatPage />;
      case 'admin':     return <AdminPage />;
      case 'profile':   return <ProfilePage user={user} onSignOut={handleSignOut} onUpdate={handleProfileUpdate} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div class="h-screen bg-slate-950 flex items-center justify-center">
        <div class="text-center space-y-3">
          <img src="/icon-192.svg" alt="TacComm" class="w-16 h-16 mx-auto rounded-2xl animate-pulse" />
          <p class="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — show auth screens
  if (!isAuthenticated) {
    return (
      <>
        {authView === 'signin' ? (
          <SignInPage onSignIn={handleSignIn} onForgotPassword={() => setAuthView('forgot')} />
        ) : (
          <ForgotPasswordPage onBack={() => setAuthView('signin')} />
        )}
      </>
    );
  }

  // Authenticated — show main app
  return (
    <div class="flex flex-col md:flex-row h-screen bg-slate-950 text-white overflow-hidden">
      <NavBar activePage={page} onNavigate={setPage} installBarVisible={installBarVisible} />
      <div class="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onNavigate={setPage} onSignOut={handleSignOut} />
        <main class="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <InstallPrompt onVisibilityChange={setInstallBarVisible} />
    </div>
  );
}
