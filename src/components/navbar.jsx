import { Link } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import { MdLanguage } from "react-icons/md";
import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import text from "../text";

const NavBar = () => {
     const [open, setOpen] = useState(false);
     const { lang, setLang } = useContext(LanguageContext);
     const [isOpen, setIsOpen] = useState(false);
     const t = (key, lang) => {
       return text[key]?.[lang] || text[key]?.en;
     };
     useEffect(() => {
       localStorage.setItem("lang", lang);
     }, [lang]);
  return (
    <>
      <div>
        <div className="header flex items-center justify-between p-4 text-green-800 text-xl font-semibold relative  border-green-800 border-2">
          <div className="flex items-center justify-between gap-5">
            <div>
              <Link to="/">
                <img src="..." alt="Logo" className="h-16 w-16 mr-1" />
              </Link>
            </div>
            <div>
              <Link className="navbar-brand " to="/">
                {t("Khairat", lang)}
              </Link>
            </div>
          </div>
          <div className="md:flex items-center gap-10 justify-between">
            <div className="hidden md:flex items-center gap-20 p-4 justify-between">
              <div>
                <Link className="navbar-brand " to="/programs">
                  {t("nav_programs", lang)}
                </Link>
                <Link className="navbar-brand" to="/about">
                  {t("nav_about", lang)}
                </Link>
              </div>
              <div></div>
              <div>
                <Link className="navbar-brand " to="/contact">
                  {t("nav_contact", lang)}
                </Link>
              </div>
              <div>
                <Link className="navbar-brand " to="/admissions">
                  {t("nav_admissions", lang)}
                </Link>
              </div>
            </div>
            {/* language selector  */}
            <button
              className=" text-2xl text-green-800 hover:scale-110 transition-transform p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <MdLanguage size={24} />
            </button>
            {isOpen && (
              <div className="absolute right-0 top-full bg-white border-green-800 shadow-lg z-50">
                <button
                  className="block px-6 py-3 border-b border-t border-green-800 w-full text-left"
                  onClick={() => {
                    setIsOpen(false);
                    setLang("en");
                  }}
                >
                  English
                </button>

                <button
                  className="block px-6 py-3 border-b border-green-800 w-full text-left"
                  onClick={() => {
                    setIsOpen(false);
                    setLang("sw");
                  }}
                >
                  Kiswahili
                </button>

                <button
                  className="block px-6 py-3 border-b border-green-800 w-full text-left"
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
          {/* Mobile menu button */}
          <button
            className="md:hidden text-2xl text-green-800 hover:scale-110 transition-transform"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
          {/* Mobile menu */}
          {open && (
            <div className="md:hidden absolute right-0 top-full bg-white border-green-800 shadow-lg z-50">
              <Link
                className="block px-6 py-3  border-b border-t border-green-800 "
                to="/"
                onClick={() => setOpen(false)}
              >
                {t("Khairat", lang)}
              </Link>
              <Link
                className="block px-6 py-3  border-b border-green-800 "
                to="/programs"
                onClick={() => setOpen(false)}
              >
                {t("nav_programs", lang)}
              </Link>
              <Link
                className="block px-6 py-3  border-b border-green-800 "
                to="/about"
                onClick={() => setOpen(false)}
              >
                {t("nav_about", lang)}
              </Link>
              <Link
                className="block px-6 py-3  border-b border-green-800 "
                to="/admissions"
                onClick={() => setOpen(false)}
              >
                {t("nav_admissions", lang)}
              </Link>
              <Link
                className="block px-6 py-3  border-b border-green-800 "
                to="/contact"
                onClick={() => setOpen(false)}
              >
                {t("nav_contact", lang)}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default NavBar;
