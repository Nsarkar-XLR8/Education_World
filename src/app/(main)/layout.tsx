import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VoiceControl from '@/components/features/VoiceControl';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        {children}
      </main>
      <VoiceControl />
      <Footer />
    </>
  );
}
