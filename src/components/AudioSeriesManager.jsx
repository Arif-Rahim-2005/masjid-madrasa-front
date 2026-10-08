import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AudioSeriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);

  const [categoryId, setCategoryId] = useState("");

  const [nameEn, setNameEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  const [nameSw, setNameSw] = useState("");
  const [descriptionSw, setDescriptionSw] = useState("");

  const [nameAr, setNameAr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("access_token");

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/audio-categories?language=en`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    if (!nameEn.trim() || !nameSw.trim() || !nameAr.trim()) {
      setError("All three series names are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        editingId !== null
          ? `${API_URL}/audio-series/${editingId}`
          : `${API_URL}/audio-series`,
        {
          method: editingId !== null ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category_id: Number(categoryId),

            name_en: nameEn.trim(),
            description_en: descriptionEn.trim(),

            name_sw: nameSw.trim(),
            description_sw: descriptionSw.trim(),

            name_ar: nameAr.trim(),
            description_ar: descriptionAr.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save series");
      }

      if (editingId !== null) {
        setSeries((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  category_id: Number(categoryId),

                  nameEn: nameEn.trim(),
                  descriptionEn: descriptionEn.trim(),

                  nameSw: nameSw.trim(),
                  descriptionSw: descriptionSw.trim(),

                  nameAr: nameAr.trim(),
                  descriptionAr: descriptionAr.trim(),
                }
              : item,
          ),
        );
      } else {
        fetchSeries(categoryId);
      }

      setNameEn("");
      setDescriptionEn("");

      setNameSw("");
      setDescriptionSw("");

      setNameAr("");
      setDescriptionAr("");

      setEditingId(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setNameEn(item.nameEn);
    setDescriptionEn(item.descriptionEn);

    setNameSw(item.nameSw);
    setDescriptionSw(item.descriptionSw);

    setNameAr(item.nameAr);
    setDescriptionAr(item.descriptionAr);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this series?")) return;

    try {
      const response = await fetch(`${API_URL}/audio-series/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete series");
      }

      fetchSeries(categoryId);

      if (editingId === id) {
        setNameEn("");
        setDescriptionEn("");

        setNameSw("");
        setDescriptionSw("");

        setNameAr("");
        setDescriptionAr("");

        setEditingId(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Audio Series</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Category */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Category</label>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
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

      {/* Create / Update Series */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* English */}
        <div>
          <h3 className="font-semibold mb-3">English</h3>

          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="Series name"
            className="border rounded px-3 py-2 w-full mb-3"
          />

          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            placeholder="Description"
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {/* Swahili */}
        <div>
          <h3 className="font-semibold mb-3">Kiswahili</h3>

          <input
            type="text"
            value={nameSw}
            onChange={(e) => setNameSw(e.target.value)}
            placeholder="Jina la mfululizo"
            className="border rounded px-3 py-2 w-full mb-3"
          />

          <textarea
            value={descriptionSw}
            onChange={(e) => setDescriptionSw(e.target.value)}
            placeholder="Maelezo"
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {/* Arabic */}
        <div>
          <h3 className="font-semibold mb-3">العربية</h3>

          <input
            type="text"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder="اسم السلسلة"
            dir="rtl"
            className="border rounded px-3 py-2 w-full mb-3"
          />

          <textarea
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            placeholder="الوصف"
            dir="rtl"
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-5 py-2 rounded"
        >
          {loading
            ? editingId !== null
              ? "Updating..."
              : "Creating..."
            : editingId !== null
              ? "Update Series"
              : "Create Series"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);

              setNameEn("");
              setDescriptionEn("");

              setNameSw("");
              setDescriptionSw("");

              setNameAr("");
              setDescriptionAr("");
            }}
            className="ml-3 bg-gray-500 text-white px-5 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Existing Series */}
      {categoryId && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Existing Series</h3>

          <div className="space-y-3">
            {series.map((item) => (
              <div
                key={item.id}
                className="border rounded p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{item.nameEn}</p>

                  {item.descriptionEn && (
                    <p className="text-sm text-gray-600">
                      {item.descriptionEn}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-white bg-blue-600 px-5 py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-white bg-red-600 px-5 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioSeriesManager;
