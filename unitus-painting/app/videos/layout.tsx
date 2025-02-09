import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
} 