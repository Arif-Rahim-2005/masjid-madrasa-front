import { Link } from "react-router-dom";
import React from "react";
import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import text from "../text";

const Footer = () => {
  const { lang } = useContext(LanguageContext);
 const t = (key) => {
   return text[key]?.[lang] || text[key]?.en;
 };

  return (
    <footer className="bg-white text-green-800 py-10 border-t border-green-800 ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        <div>
          <h4 className="text-xl font-semibold mb-3">
            {" "}
            {t("Khairat")}
          </h4>
          <p className="text-sm text-gray-400">
            {t("hero_tagline")}
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-3">{t("Quick links")}</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/programs" className="hover:underline">
                {t("nav_programs")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                {t("nav_about")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-3">{t("nav_contact")}</h4>
          <button
            className="text-sm hover:underline"
            onClick={() => {
              window.open(
                "https://www.google.com/maps/place/Madrasatul+Khairat+Al+-+Islamiyyah/@-4.0379336,39.6640323,17z/data=!4m14!1m7!3m6!1s0x184012bafea8e4f5:0xfff876d7199e340f!2sMadrasatul+Khairat+Al+-+Islamiyyah!8m2!3d-4.0379229!4d39.6644722!16s%2Fg%2F11w_rsp6_c!3m5!1s0x184012bafea8e4f5:0xfff876d7199e340f!8m2!3d-4.0379229!4d39.6644722!16s%2Fg%2F11w_rsp6_c!5m1!1e4?entry=ttu&g_ep=EgoyMDI2MDQyNy4wIKXMDSoASAFQAw%3D%3D",
              );
            }}
          >{t("Khairat")}, Mombasa (view location)
          </button>
          <p className="text-sm">📞 0722867998</p>
          <p className="text-sm">📞 0706900433</p>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()}
        Masjid and Madrasatul Khairat Al-Islamiyyah. All rights reserved.
      </p>
    </footer>
  );
};
export default Footer;
