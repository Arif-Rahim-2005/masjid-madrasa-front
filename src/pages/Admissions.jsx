import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../components/LanguageContext";
import text from "../text";

const API_URL = import.meta.env.VITE_API_URL;

const Admissions = () => {
  const { lang } = useContext(LanguageContext);

  const t = (key) => {
    return text[key]?.[lang] || text[key]?.en;
  };

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${API_URL}/documents`);

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();

        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <main className="text-green-800">
      <section className="relative h-96 flex items-center justify-center">
        <img
          src="/slides/slide 3.png"
          alt="Admissions"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("admissionsHeroTitle")}
          </h1>

          <p className="mt-4 text-lg md:text-xl">
            {t("admissionsHeroSubtitle")}
          </p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("admissionsInfoTitle")}
          </h2>

          <p className="mt-6 text-lg leading-8">{t("admissionsInfoText")}</p>
        </div>
      </section>
      <section className="bg-white border-y shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-8">
              <h2 className="text-3xl font-bold">
                {t("admissionsRequirementsTitle")}
              </h2>

              <ul className="mt-6 space-y-4 list-disc list-inside text-lg">
                <li>{t("admissionRequirement1")}</li>
                <li>{t("admissionRequirement2")}</li>
                <li>{t("admissionRequirement3")}</li>
                <li>{t("admissionRequirement4")}</li>
              </ul>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold">
                {t("admissionsHowToApplyTitle")}
              </h2>

              <p className="mt-6 text-lg leading-8">
                {t("admissionsHowToApplyText")}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          {t("admissionsDocumentsTitle")}
        </h2>

        <p className="text-center mt-4 max-w-2xl mx-auto text-lg">
          {t("admissionsDocumentsText")}
        </p>

        {documents.length === 0 ? (
          <p className="text-center mt-10">{t("admissionsNoDocuments")}</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {documents.map((document) => (
              <div
                key={document.id}
                className="bg-white p-6 rounded-xl shadow-xl"
              >
                <h3 className="text-xl font-bold">{document.title}</h3>

                <p className="mt-2 text-sm">{document.document_type}</p>

                <a
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-5 bg-green-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  {t("admissionsViewDocument")}
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Admissions;
