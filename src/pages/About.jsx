import React, { useContext } from "react";
import { LanguageContext } from "../components/LanguageContext";
import text from "../text";

const About = () => {
  const { lang } = useContext(LanguageContext);

  const t = (key) => {
    return text[key]?.[lang] || text[key]?.en;
  };

  return (
    <main className="text-green-800">
      <section className="relative h-96 flex items-center justify-center">
        <img
          src="/slides/slide 1.png"
          alt="Masjid and Madrasatul Kheirat Al-Islamiyyah"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("aboutHeroTitle")}
          </h1>

          <p className="mt-4 text-lg md:text-xl">{t("aboutHeroSubtitle")}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <img
            src="/logo.png"
            alt="Islamic education"
            className="w-full h-80 object-cover rounded-xl shadow-xl"
          />

          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("aboutWhoWeAreTitle")}
            </h2>

            <p className="mt-6 text-lg leading-8">{t("aboutWhoWeAreText")}</p>
          </div>
        </div>
      </section>
      <section className="bg-white border-y shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("aboutMissionTitle")}
          </h2>

          <p className="mt-6 text-lg leading-8">{t("aboutMissionText")}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          {t("aboutApproachTitle")}
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center">
            <h3 className="text-2xl font-bold">{t("aboutQuranTitle")}</h3>

            <p className="mt-4 leading-7">{t("aboutQuranText")}</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl text-center">
            <h3 className="text-2xl font-bold">{t("aboutKnowledgeTitle")}</h3>

            <p className="mt-4 leading-7">{t("aboutKnowledgeText")}</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl text-center">
            <h3 className="text-2xl font-bold">{t("aboutCharacterTitle")}</h3>

            <p className="mt-4 leading-7">{t("aboutCharacterText")}</p>
          </div>
        </div>
      </section>
      <section className="bg-white border-y shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="text-center p-8">
              <h2 className="text-3xl font-bold">{t("aboutMasjidTitle")}</h2>

              <p className="mt-5 text-lg leading-8">{t("aboutMasjidText")}</p>
            </div>

            <div className="text-center p-8">
              <h2 className="text-3xl font-bold">{t("aboutMadrasaTitle")}</h2>

              <p className="mt-5 text-lg leading-8">{t("aboutMadrasaText")}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          {t("aboutClosingTitle")}
        </h2>

        <p className="mt-5 text-lg leading-8">{t("aboutClosingText")}</p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <a
            href="/programs"
            className="bg-green-800 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {t("viewPrograms")}
          </a>

          <a
            href="/admissions"
            className="border-2 border-green-800 px-7 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            {t("nav_admissions")}
          </a>
        </div>
      </section>
    </main>
  );
};

export default About;
