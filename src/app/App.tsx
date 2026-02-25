import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { HomePage } from './pages/home-page';
// import { OurStoryPage } from './pages/our-story-page';
// import { LoveLettersPage } from './pages/love-letters-page';
// import { MemoriesPage } from './pages/memories-page';
// import { PrivateGalleryPage } from './pages/private-gallery-page';
import { FloatingHearts } from './components/floating-hearts';

export default function App() {
  return (
    <Router>
      <div className="min-h-[100svh] bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 relative overflow-x-clip">
        <FloatingHearts />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/love-letters" element={<LoveLettersPage />} />
          <Route path="/memories" element={<MemoriesPage />} /> */}
          {/* <Route path="/private" element={<PrivateGalleryPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
