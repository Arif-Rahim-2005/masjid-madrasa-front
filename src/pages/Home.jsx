import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { LanguageContext } from "../components/LanguageContext";
import text from "../text";
import { Link } from "react-router-dom";

const Home = () => {
  const { lang } = useContext(LanguageContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const [masjidPrograms, setMasjidPrograms] = useState([]);
  const [madrasaPrograms, setMadrasaPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const t = (key, lang) => {
    return text[key]?.[lang] || text[key]?.en;
  };
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

        setMasjidPrograms(masjidData.programs || masjidData);
        setMadrasaPrograms(madrasaData.programs || madrasaData);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoadingPrograms(false);
      }
    };

    fetchPrograms();
  }, [lang]);
  return (
    <>
      <main className=" text-green-800">
        <div>
          <Swiper
            spaceBetween={30}
            effect={"fade"}
            navigation={true}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
            }}
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            className="h-100 md:h-170 w-full mx-auto mb-4 rounded-lg shadow-lg"
          >
            <SwiperSlide>
              <img
                src="/slides/slide 1.png"
                alt="Slider 1"
                style={{ width: "100%", height: "100%" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50"></div>
              {/* Text content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                <h1 className="text-3xl md:text-5xl font-bold">
                  {t("hero_welcome", lang)}
                </h1>
                <p className="mt-4 text-lg md:text-xl">
                  {t("hero_tagline", lang)}
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/slides/slide 2.png"
                alt="Slider 2"
                style={{ width: "100%", height: "100%" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50"></div>
              {/* Text content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                <h1 className="text-3xl md:text-5xl font-bold">
                  {t("slide2Title", lang)}
                </h1>
                <p className="mt-4 text-lg md:text-xl">
                  {t("slide2Subtitle", lang)}
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/slides/slide 3.png"
                alt="Slider 3"
                style={{ width: "100%", height: "100%" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50"></div>
              {/* Text content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                <h1 className="text-3xl md:text-5xl font-bold">
                  {t("slide3Title", lang)}
                </h1>
                <p className="mt-4 text-lg md:text-xl">
                  {t("slide3Subtitle", lang)}
                </p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("sectionTitle", lang)}
          </h2>
          {/* Masjid */}
          ...
          {/* Masjid Programs */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
              {t("masjidProgramsTitle", lang)}
            </h2>

            {loadingPrograms ? (
              <p className="text-center">Loading programs...</p>
            ) : masjidPrograms.length === 0 ? (
              <p className="text-center">No Masjid programs available.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {masjidPrograms.slice(0, 2).map((program) => (
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
          {/* Madrasa Programs */}
          <section className="mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
              {t("madrasaProgramsTitle", lang)}
            </h2>

            {loadingPrograms ? (
              <p className="text-center">Loading programs...</p>
            ) : madrasaPrograms.length === 0 ? (
              <p className="text-center">No Madrasa programs available.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {madrasaPrograms.slice(0, 2).map((program) => (
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
        <div className="flex justify-center mt-12">
          <Link
            to="/programs"
            className="bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg"
          >
            {t("viewPrograms", lang)}
          </Link>
        </div>
        {/* Short Introduction */}
        <section className="mt-20 bg-white shadow-2xl shadow-black/20 p-8 md:p-12 text-center border-t-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("introTitle", lang)}
          </h2>

          <p className="max-w-4xl mx-auto text-lg leading-8">
            {t("introText", lang)}
          </p>
          <Link
            to="/about"
            className="inline-block mt-8 bg-green-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {t("introButton", lang)}
          </Link>
        </section>
      </main>
    </>
  );
};
export default Home;
