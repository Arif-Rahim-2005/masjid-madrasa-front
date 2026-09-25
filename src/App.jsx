import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import LanguageProvider from "./components/LanguageContext";

import Home from "./pages/Home";
import Programs from "./pages/Programs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admissions from "./pages/Admissions";
import SecurityPage from "./pages/Security";

const Layout = () => {
  const location = useLocation();

  const isAdminPage = location.pathname === "/admin";

  return (
    <>
      {!isAdminPage && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/admin" element={<SecurityPage />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
