import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../components/LanguageContext";
import text from "../text";

const API_URL = import.meta.env.VITE_API_URL;

const Programs = () => {
  const { lang } = useContext(LanguageContext);

  const t = (key) => {
    return text[key]?.[lang] || text[key]?.en;
  };

  const [masjidPrograms, setMasjidPrograms] = useState([]);
  const [madrasaPrograms, setMadrasaPrograms] = useState([]);
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const [masjidResponse, madrasaResponse] = await Promise.all([
          fetch(`${API_URL}/masjid-programs?language=${lang}`),
          fetch(`${API_URL}/madrasa-programs?language=${lang}`),
        ]);

        if (!masjidResponse.ok || !madrasaResponse.ok) {
          throw new Error("Failed to fetch programs");
        }

        const masjidData = await masjidResponse.json();
        const madrasaData = await madrasaResponse.json();

        setMasjidPrograms(masjidData);
        setMadrasaPrograms(madrasaData);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, [lang]);
  return (
    <main className="text-green-800">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          {t("sectionTitle")}
        </h1>

        <p className="text-center mt-4 max-w-2xl mx-auto text-lg">
          {t("introText")}
        </p>
        <section className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            {t("masjidProgramsTitle")}
          </h2>

          {masjidPrograms.length === 0 ? (
            <p className="text-center">No Masjid programs available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {masjidPrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-xl overflow-hidden shadow-xl"
                >
                  <img
                    src={program.image?.url}
                    alt={program.translation.program_name}
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold">
                      {program.translation.program_name}
                    </h3>

                    <p className="mt-3">
                      {program.translation.program_schedule}
                    </p>

                    {program.translation.book && (
                      <p className="mt-2">{program.translation.book}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            {t("madrasaProgramsTitle")}
          </h2>

          {madrasaPrograms.length === 0 ? (
            <p className="text-center">No Madrasa programs available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {madrasaPrograms.map((program) => (
                <div
                  key={program.program_id}
                  className="bg-white rounded-xl overflow-hidden shadow-xl"
                >
                  <img
                    src={program.image?.url}
                    alt={program.program_name}
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold">
                      {program.program_name}
                    </h3>

                    <p className="mt-3">{program.subjects}</p>

                    <p className="mt-2">{program.schedule}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Programs;
