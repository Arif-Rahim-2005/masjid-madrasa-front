import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../components/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL;

const Announcements = () => {
  const { lang } = useContext(LanguageContext);

  const [announcements, setAnnouncements] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [announcementResponse, imageResponse] = await Promise.all([
          fetch(`${API_URL}/announcements?language=${lang}`),
          fetch(`${API_URL}/images`),
        ]);

        if (!announcementResponse.ok) {
          throw new Error("Failed to load announcements.");
        }

        if (!imageResponse.ok) {
          throw new Error("Failed to load images.");
        }

        const [announcementData, imageData] = await Promise.all([
          announcementResponse.json(),
          imageResponse.json(),
        ]);

        setAnnouncements(announcementData);
        setImages(imageData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang]);

  const getImage = (imageId) => {
    return images.find((image) => image.id === imageId);
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      lang === "ar" ? "ar" : lang === "sw" ? "sw-KE" : "en",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-50 px-4 py-10"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-green-700 sm:text-4xl">
            {lang === "ar"
              ? "الإعلانات"
              : lang === "sw"
                ? "Matangazo"
                : "Announcements"}
          </h1>

          <p className="mt-3 text-gray-600">
            {lang === "ar"
              ? "آخر الأخبار والإعلانات من المسجد والمدرسة."
              : lang === "sw"
                ? "Habari na matangazo ya hivi karibuni kutoka msikitini na madrasa."
                : "The latest news and announcements from our masjid and madrasa."}
          </p>
        </header>

        {loading && (
          <p className="py-10 text-center text-gray-500">
            {lang === "ar"
              ? "جارٍ تحميل الإعلانات..."
              : lang === "sw"
                ? "Inapakia matangazo..."
                : "Loading announcements..."}
          </p>
        )}

        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-5 text-center text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && announcements.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-gray-600">
              {lang === "ar"
                ? "لا توجد إعلانات حالياً."
                : lang === "sw"
                  ? "Hakuna matangazo kwa sasa."
                  : "There are no announcements at the moment."}
            </p>
          </div>
        )}

        {!loading && !error && announcements.length > 0 && (
          <div className="space-y-6">
            {announcements.map((announcement) => {
              const image = getImage(announcement.image_id);

              return (
                <article
                  key={announcement.announcement_id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  {image?.url && (
                    <img
                      src={image.url}
                      alt={announcement.title}
                      className="max-h-[420px] w-full object-cover"
                      loading="lazy"
                    />
                  )}

                  <div className="p-6 sm:p-8">
                    {announcement.created_at && (
                      <time
                        dateTime={announcement.created_at}
                        className="text-sm text-gray-500"
                      >
                        {formatDate(announcement.created_at)}
                      </time>
                    )}

                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                      {announcement.title}
                    </h2>

                    <p className="mt-4 whitespace-pre-line leading-7 text-gray-700">
                      {announcement.content}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Announcements;
