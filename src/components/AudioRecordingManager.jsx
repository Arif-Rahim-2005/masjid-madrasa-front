import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AudioRecordingManager = () => {
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);

  const [speaker, setSpeaker] = useState("");
  const [recordings, setRecordings] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [seriesId, setSeriesId] = useState("");

  const [audioFile, setAudioFile] = useState(null);

  const [titleEn, setTitleEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  const [titleSw, setTitleSw] = useState("");
  const [descriptionSw, setDescriptionSw] = useState("");

  const [titleAr, setTitleAr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");

  const [recordedAt, setRecordedAt] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);

  const [expandedRecordingId, setExpandedRecordingId] = useState(null);

  const token = localStorage.getItem("access_token");
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/audio-categories?language=en`,
        {},
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchSeries = async (id) => {
    if (!id) {
      setSeries([]);
      return;
    }

    try {
      const languages = ["en", "sw", "ar"];

      const responses = await Promise.all(
        languages.map((language) =>
          fetch(`${API_URL}/audio-series/${id}?language=${language}`),
        ),
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error("Failed to fetch series");
      }

      const [enData, swData, arData] = await Promise.all(
        responses.map((response) => response.json()),
      );

      const combinedSeries = enData.map((item) => {
        const swItem = swData.find((series) => series.id === item.id);

        const arItem = arData.find((series) => series.id === item.id);

        return {
          id: item.id,
          category_id: item.category_id,

          nameEn: item.name,
          descriptionEn: item.description || "",

          nameSw: swItem?.name || "",
          descriptionSw: swItem?.description || "",

          nameAr: arItem?.name || "",
          descriptionAr: arItem?.description || "",
        };
      });

      setSeries(combinedSeries);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSeries(categoryId);
  }, [categoryId]);

  useEffect(() => {
    setSeriesId("");
    fetchSeries(categoryId);
  }, [categoryId]);
    
    useEffect(() => {
      if (selectedCategory) {
        fetchSeries(selectedCategory.id);
      } else {
        setSeries([]);
      }
    }, [selectedCategory]);

  const fetchRecordings = async () => {
    // if (!categoryId) {
    //   setRecordings([]);
    //   return;
    // }

    try {
      const languages = ["en", "sw", "ar"];

      const queryParams = new URLSearchParams({
        category_id: categoryId,
      });

      if (seriesId) {
        queryParams.append("series_id", seriesId);
      }

      const responses = await Promise.all(
        languages.map((language) =>
          fetch(
            `${API_URL}/audio-recordings?language=${language}&${queryParams.toString()}`,
          ),
        ),
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error("Failed to fetch recordings");
      }

      const [enData, swData, arData] = await Promise.all(
        responses.map((response) => response.json()),
      );

      const combinedRecordings = enData.map((item) => {
        const swItem = swData.find((recording) => recording.id === item.id);

        const arItem = arData.find((recording) => recording.id === item.id);

        return {
          id: item.id,
          category_id: item.category_id,
          series_id: item.series_id,

          titleEn: item.title,
          descriptionEn: item.description || "",

          titleSw: swItem?.title || "",
          descriptionSw: swItem?.description || "",

          titleAr: arItem?.title || "",
          descriptionAr: arItem?.description || "",

          speaker: item.speaker || "",
          recordedAt: item.recorded_at || "",
          audioUrl: item.audio_url,
        };
      });

      setRecordings(combinedRecordings);
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    fetchRecordings();
  }, [categoryId, seriesId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("category_id", categoryId);

      if (seriesId) {
        formData.append("series_id", seriesId);
      }

      formData.append("title_en", titleEn);
      formData.append("description_en", descriptionEn);

      formData.append("title_sw", titleSw);
      formData.append("description_sw", descriptionSw);

      formData.append("title_ar", titleAr);
      formData.append("description_ar", descriptionAr);

      formData.append("speaker", speaker);
      formData.append("recorded_at", recordedAt);

      if (audioFile) {
        formData.append("audio", audioFile);
      }

      const url = editingId
        ? `${API_URL}/audio-recordings/${editingId}`
        : `${API_URL}/audio-recordings`;

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save recording");
      }

      await fetchRecordings();

      setEditingId(null);
      setAudioFile(null);
      setTitleEn("");
      setDescriptionEn("");
      setTitleSw("");
      setDescriptionSw("");
      setTitleAr("");
      setDescriptionAr("");
      setSpeaker("");
      setRecordedAt("");
      setSeriesId("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recording?")) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/audio-recordings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete recording");
      }

      await fetchRecordings();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (recording) => {
    setEditingId(recording.id);

    setCategoryId(recording.category_id || "");
    setSeriesId(recording.series_id || "");

    setTitleEn(recording.titleEn || "");
    setDescriptionEn(recording.descriptionEn || "");

    setTitleSw(recording.titleSw || "");
    setDescriptionSw(recording.descriptionSw || "");

    setTitleAr(recording.titleAr || "");
    setDescriptionAr(recording.descriptionAr || "");

    setSpeaker(recording.speaker || "");
    setRecordedAt(recording.recordedAt || "");

    setAudioFile(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 my-6">
        <div>
          <h2 className="text-xl font-semibold mb-6">
            {editingId ? "Edit Audio Recording" : "Add Audio Recording"}
          </h2>

          {error && <p>{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Category</label>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Series */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Series</label>

              <select
                value={seriesId}
                onChange={(e) => setSeriesId(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">No series</option>

                {series.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* English */}
            <h3 className="font-semibold mb-3">English</h3>

            <input
              type="text"
              placeholder="English title"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full mb-3"
            />

            <textarea
              placeholder="English description"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-3"
            />

            {/* Swahili */}
            <h3 className="font-semibold mb-3">Kiswahili</h3>

            <input
              type="text"
              placeholder="Swahili title"
              value={titleSw}
              onChange={(e) => setTitleSw(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full mb-3"
            />

            <textarea
              placeholder="Swahili description"
              value={descriptionSw}
              onChange={(e) => setDescriptionSw(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-3"
            />

            {/* Arabic */}
            <h3 className="font-semibold mb-3">العربية</h3>

            <input
              type="text"
              placeholder="Arabic title"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full mb-3"
            />

            <textarea
              placeholder="Arabic description"
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-3"
            />

            {/* Speaker */}
            <div className="font-semibold mb-3">
              <label className="block mb-2">Speaker</label>

              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Speaker name"
                required
                className="border rounded px-3 py-2 w-full mb-3"
              />
            </div>

            {/* Recorded date */}
            <div className="font-semibold mb-3">
              <label>Recorded At</label>

              <input
                type="date"
                value={recordedAt}
                onChange={(e) => setRecordedAt(e.target.value)}
                className="border rounded px-3 py-2 w-full mb-3"
              />
            </div>

            {/* Audio */}
            <div className="font-semibold mb-3">
              <label className="block mb-2">
                {editingId ? "Replace audio (optional)" : "Audio file"}
              </label>

              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
                required={!editingId}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white py-2 px-4 rounded mb-2"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Recording"
                  : "Add Recording"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitleEn("");
                  setDescriptionEn("");
                  setTitleSw("");
                  setDescriptionSw("");
                  setTitleAr("");
                  setDescriptionAr("");
                  setSpeaker("");
                  setRecordedAt("");
                  setAudioFile(null);
                  setSeriesId("");
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
        <div>
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Audio Library
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage recorded lessons, khutbas, dawras and other audio
                content.
              </p>
            </div>

            {/* CATEGORY VIEW */}
            {!selectedCategory && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedSeries(null);
                      setCategoryId(category.id);
                      setSeriesId("");
                    }}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="text-4xl">📁</div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Open category
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* SERIES VIEW */}
            {selectedCategory && !selectedSeries && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSeries(null);
                    setCategoryId("");
                    setSeriesId("");
                  }}
                  className="mb-5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  ← Back to categories
                </button>

                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  {selectedCategory.name}
                </h3>

                {series.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                    <p className="font-medium text-gray-600">
                      No series found in this category.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {series.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedSeries(item);
                          setCategoryId(item.category_id);
                          setSeriesId(item.id);
                        }}
                        className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                      >
                        <div className="text-4xl">📁</div>

                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item.nameEn}
                          </h4>

                          {item.descriptionEn && (
                            <p className="mt-1 text-sm text-gray-500">
                              {item.descriptionEn}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RECORDINGS VIEW */}
            {selectedCategory && selectedSeries && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSeries(null);
                    setSeriesId("");
                  }}
                  className="mb-5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  ← Back to {selectedCategory.name}
                </button>

                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedSeries.nameEn}
                  </h3>

                  {selectedSeries.descriptionEn && (
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedSeries.descriptionEn}
                    </p>
                  )}
                </div>

                {recordings.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                    <p className="font-medium text-gray-600">
                      No recordings found in this series.
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Add an audio recording to see it here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recordings.map((recording) => {
                      const isExpanded = expandedRecordingId === recording.id;

                      return (
                        <div
                          key={recording.id}
                          className="rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                          <div className="flex items-center gap-4 p-4">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedRecordingId(
                                  isExpanded ? null : recording.id,
                                )
                              }
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition hover:bg-blue-200"
                            >
                              {isExpanded ? "❚❚" : "▶"}
                            </button>

                            <div className="min-w-0 flex-1">
                              <h4 className="truncate font-semibold text-gray-900">
                                {recording.titleEn}
                              </h4>

                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                {recording.speaker && (
                                  <span>Speaker: {recording.speaker}</span>
                                )}

                                {recording.recordedAt && (
                                  <span>{recording.recordedAt}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(recording)}
                                className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(recording.id)}
                                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-gray-100 px-4 py-4">
                              {recording.descriptionEn && (
                                <p className="mb-3 text-sm text-gray-600">
                                  {recording.descriptionEn}
                                </p>
                              )}

                              <audio
                                controls
                                src={recording.audioUrl}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default AudioRecordingManager;
