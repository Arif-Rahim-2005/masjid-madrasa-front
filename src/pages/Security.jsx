import { Link } from "react-router-dom";
import React from "react";
import { useState, useEffect, useContext } from "react";
import { MdLanguage } from "react-icons/md";
import { LanguageContext } from "../components/LanguageContext";
import text from "../text";
import { User } from "lucide-react";
import LoginModal from "../components/Login";
import SignUpModal from "../components/SignUp";

const API_URL = import.meta.env.VITE_API_URL;

const SecurityPage = () => {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);

  const t = (key, lang) => {
    return text[key]?.[lang] || text[key]?.en;
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.user || data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <div>
        <div className="header relative flex items-center justify-between border-b border-green-800 bg-white px-4 py-3 text-green-800 shadow-sm">
          {/* Logo + Name */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <img src="..." alt="Logo" className="h-14 w-14 object-contain" />
            </Link>

            <Link
              className="text-xl font-semibold hover:text-green-600 transition-colors"
              to="/"
            >
              {t("Khairat", lang)}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              className="transition-colors hover:text-green-600"
              to="/programs"
            >
              {t("nav_programs", lang)}
            </Link>

            <Link
              className="transition-colors hover:text-green-600"
              to="/about"
            >
              {t("nav_about", lang)}
            </Link>

            <Link
              className="transition-colors hover:text-green-600"
              to="/contact"
            >
              {t("nav_contact", lang)}
            </Link>

            <Link
              className="transition-colors hover:text-green-600"
              to="/admissions"
            >
              {t("nav_admissions", lang)}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                className="flex items-center justify-center rounded-full p-2 text-green-800 transition-all hover:bg-green-50 hover:scale-110"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Change language"
              >
                <MdLanguage size={24} />
              </button>

              {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-md border border-green-800 bg-white shadow-lg z-50">
                  <button
                    className="block w-full px-5 py-3 text-left text-sm hover:bg-green-50 transition-colors"
                    onClick={() => {
                      setIsOpen(false);
                      setLang("en");
                    }}
                  >
                    English
                  </button>

                  <button
                    className="block w-full border-t border-green-100 px-5 py-3 text-left text-sm hover:bg-green-50 transition-colors"
                    onClick={() => {
                      setIsOpen(false);
                      setLang("sw");
                    }}
                  >
                    Kiswahili
                  </button>

                  <button
                    className="block w-full border-t border-green-100 px-5 py-3 text-left text-sm hover:bg-green-50 transition-colors"
                    onClick={() => {
                      setIsOpen(false);
                      setLang("ar");
                    }}
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center justify-center rounded-full p-2 text-green-800 transition-all hover:bg-green-50 hover:scale-110 focus:outline-none"
                aria-label="Account menu"
              >
                <User className="h-6 w-6" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-md border border-green-800 bg-white shadow-lg z-50">
                  <button
                    className="block w-full px-4 py-3 text-left text-sm hover:bg-green-50 transition-colors"
                    onClick={() => {
                      setShowLogin(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Login
                  </button>

                  <button
                    className="block w-full border-t border-green-100 px-4 py-3 text-left text-sm hover:bg-green-50 transition-colors"
                    onClick={() => {
                      setShowSignup(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Signup
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Profile */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center justify-center rounded-full p-2 text-green-800 transition-all hover:bg-green-50 hover:scale-110 focus:outline-none"
                aria-label="Account menu"
              >
                <User className="h-6 w-6" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-md border border-green-800 bg-white shadow-lg z-50">
                  <button
                    className="block w-full px-4 py-3 text-left text-sm hover:bg-green-50 transition-colors"
                    onClick={() => {
                      setShowLogin(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Login
                  </button>

                  <button
                    className="block w-full border-t border-green-100 px-4 py-3 text-left text-sm hover:bg-green-50 transition-colors"
                    onClick={() => {
                      setShowSignup(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Signup
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="rounded-md p-2 text-2xl text-green-800 transition-all hover:bg-green-50"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>

          {/* Mobile Navigation */}
          {open && (
            <div className="absolute left-0 right-0 top-full z-40 overflow-hidden border-t border-green-800 bg-white shadow-lg md:hidden">
              <Link
                className="block border-b border-green-100 px-6 py-3 text-green-800 hover:bg-green-50"
                to="/"
                onClick={() => setOpen(false)}
              >
                {t("Khairat", lang)}
              </Link>

              <Link
                className="block border-b border-green-100 px-6 py-3 text-green-800 hover:bg-green-50"
                to="/programs"
                onClick={() => setOpen(false)}
              >
                {t("nav_programs", lang)}
              </Link>

              <Link
                className="block border-b border-green-100 px-6 py-3 text-green-800 hover:bg-green-50"
                to="/about"
                onClick={() => setOpen(false)}
              >
                {t("nav_about", lang)}
              </Link>

              <Link
                className="block border-b border-green-100 px-6 py-3 text-green-800 hover:bg-green-50"
                to="/admissions"
                onClick={() => setOpen(false)}
              >
                {t("nav_admissions", lang)}
              </Link>

              <Link
                className="block px-6 py-3 text-green-800 hover:bg-green-50"
                to="/contact"
                onClick={() => setOpen(false)}
              >
                {t("nav_contact", lang)}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Signup Modal */}
      {showSignup && <SignUpModal onClose={() => setShowSignup(false)} />}

      {/* Unauthorized Section */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <h1 className="text-[120px] font-extrabold leading-none text-green-700 md:text-[200px]">
          404
        </h1>

        <p className="mt-4 text-xl font-semibold text-green-700 md:text-2xl">
          You are not authorized to access this page.
        </p>
      </section>
    </>
  );
};

export default SecurityPage;
