import { ApplicationForm, PrivacyNotice } from '@/features/application-form';
import { Banner, Footer, Header } from '@/widgets';
import '@/global.css';

export function App() {
  return (
    <div className="app">
      <Header />

      <main className="main">
        <Banner />
        <ApplicationForm />
      </main>

      <PrivacyNotice />

      <Footer />
    </div>
  );
}
