import { useState } from 'preact/hooks';
import { NavBar } from './components/NavBar';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { ChatPage } from './pages/ChatPage';
import { AdminPage } from './pages/AdminPage';
import type { Page } from './types/nav';

export function App() {
  const [page, setPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'map':       return <MapPage />;
      case 'chat':      return <ChatPage />;
      case 'admin':     return <AdminPage />;
    }
  };

  return (
    <div class="flex flex-col md:flex-row h-screen bg-slate-950 text-white overflow-hidden">
      <NavBar activePage={page} onNavigate={setPage} />
      <main class="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
