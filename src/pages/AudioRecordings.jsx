import { useEffect, useState } from "react";
import { LanguageContext } from "../components/LanguageContext";
import { useContext } from "react";
import text from "../recordingspagetext.json";

const API_URL = import.meta.env.VITE_API_URL;

const AudioRecordings = () => {
  const { lang } = useContext(LanguageContext);
  const t = (key) => {
    return text[key]?.[lang] || text[key]?.en || key;
  };

  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [recordings, setRecordings] = useState([]);
  const [expandedRecordingId, setExpandedRecordingId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/audio-categories?language=${lang}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [lang]);

  const fetchSeries = async (categoryId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/audio-series/${categoryId}?language=${lang}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch series");
      }

      setSeries(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCategory) {
      setSeries([]);
      return;
    }

    fetchSeries(selectedCategory.id);
  }, [selectedCategory, lang]);

  const fetchRecordings = async (categoryId, seriesId = null) => {
    try {
      setLoading(true);
      setError("");
      setRecordings([]);

      const params = new URLSearchParams();
      params.append("language", lang);

      if (categoryId) {
        params.append("category_id", categoryId);
      }

      if (seriesId) {
        params.append("series_id", seriesId);
      }

      const response = await fetch(
        `${API_URL}/audio-recordings?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recordings");
      }

      setRecordings(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSeries) {
      fetchRecordings(selectedSeries.category_id, selectedSeries.id);
    }
  }, [selectedSeries, lang]);

  useEffect(() => {
    if (!selectedCategory || selectedSeries) {
      return;
    }

    if (series.length === 0) {
      fetchRecordings(selectedCategory.id);
    }
  }, [selectedCategory, selectedSeries, series, lang]);

  return (
    <div
      className="min-h-screen bg-gray-50 px-4 py-10"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("audio_library")}
          </h1>

          <p className="mt-2 text-gray-600">{t("audio_library_description")}</p>
        </div>
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading && (
          <p className="text-gray-500">{t("loading_audio_library")}</p>
        )}
        {!loading && categories.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="font-medium text-gray-600">
              {t("no_audio_categories")}
            </p>
          </div>
        )}
        {!loading && categories.length > 0 && !selectedCategory && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedSeries(null);
                }}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="text-4xl">📁</div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    {category.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {t("browse_recordings")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedCategory && !selectedSeries && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSeries(null);
                setRecordings([]);
                setSeries([]);
                setExpandedRecordingId(null);
              }}
              className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {t("back")}
            </button>

            <h2 className="mb-5 text-2xl font-bold text-gray-900">
              {selectedCategory.name}
            </h2>

            {loading ? (
              <p className="text-gray-500">{t("loading")}</p>
            ) : series.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {series.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedSeries(item)}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="text-4xl">📁</div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recordings.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                    <p className="font-medium text-gray-600">
                      {t("no_recordings")}
                    </p>
                  </div>
                ) : (
                  recordings.map((recording) => (
                    <div
                      key={recording.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {recording.title}
                          </h3>

                          {recording.description && (
                            <p className="mt-1 text-sm text-gray-500">
                              {recording.description}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedRecordingId(
                              expandedRecordingId === recording.id
                                ? null
                                : recording.id,
                            )
                          }
                          className="shrink-0 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                          {expandedRecordingId === recording.id
                            ? t("hide")
                            : t("view")}
                        </button>
                      </div>

                      {expandedRecordingId === recording.id && (
                        <div className="mt-4">
                          <audio
                            controls
                            className="w-full"
                            src={recording.audio_url}
                          />

                          {recording.description && (
                            <p className="mt-3 text-sm text-gray-600">
                              {recording.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {selectedSeries && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                setSelectedSeries(null);
                setRecordings([]);
                setExpandedRecordingId(null);
              }}
              className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {t("back")}
            </button>

            <h2 className="mb-5 text-2xl font-bold text-gray-900">
              {selectedSeries.name}
            </h2>

            {loading ? (
              <p className="text-gray-500">{t("loading_recordings")}</p>
            ) : recordings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <p className="font-medium text-gray-600">
                  {t("no_recordings")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {recording.title}
                        </h3>

                        {recording.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {recording.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedRecordingId(
                            expandedRecordingId === recording.id
                              ? null
                              : recording.id,
                          )
                        }
                        className="shrink-0 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                      >
                        {expandedRecordingId === recording.id
                          ? t("hide")
                          : t("view")}
                      </button>
                    </div>

                    {expandedRecordingId === recording.id && (
                      <div className="mt-4">
                        <audio
                          controls
                          className="w-full"
                          src={recording.audio_url}
                        >
                          {t("browser_audio_unsupported")}
                        </audio>

                        {recording.description && (
                          <p className="mt-3 text-sm text-gray-600">
                            {recording.speaker}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecordings;
