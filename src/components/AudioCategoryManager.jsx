import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AudioCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [nameEn, setNameEn] = useState("");
  const [nameSw, setNameSw] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const languages = ["en", "sw", "ar"];

      const responses = await Promise.all(
        languages.map((language) =>
          fetch(`${API_URL}/audio-categories?language=${language}`),
        ),
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error("Failed to fetch categories");
      }

      const [enData, swData, arData] = await Promise.all(
        responses.map((response) => response.json()),
      );

      const combinedCategories = enData.map((category) => {
        const swCategory = swData.find((item) => item.id === category.id);

        const arCategory = arData.find((item) => item.id === category.id);

        return {
          id: category.id,
          nameEn: category.name,
          nameSw: swCategory?.name || "",
          nameAr: arCategory?.name || "",
        };
      });

      setCategories(combinedCategories);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameEn.trim() || !nameSw.trim() || !nameAr.trim()) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        editingId
          ? `${API_URL}/audio-categories/${editingId}`
          : `${API_URL}/audio-categories`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name_en: nameEn.trim(),
            name_sw: nameSw.trim(),
            name_ar: nameAr.trim(),
          }),
        },
      );

      const data = await response.json();

      console.log("Category response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      if (editingId) {
        setCategories((prev) =>
          prev.map((category) =>
            category.id === editingId
              ? {
                  ...category,
                  nameEn: nameEn.trim(),
                  nameSw: nameSw.trim(),
                  nameAr: nameAr.trim(),
                }
              : category,
          ),
        );
      } else {
        setCategories((prev) => [
          ...prev,
          {
            id: data.id,
            nameEn: nameEn.trim(),
            nameSw: nameSw.trim(),
            nameAr: nameAr.trim(),
          },
        ]);
      }
      setNameEn("");
      setNameSw("");
      setNameAr("");
      setEditingId(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (category) => {
    setEditingId(category.id);
    setNameEn(category.nameEn);
    setNameSw(category.nameSw);
    setNameAr(category.nameAr);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this audio category?")) return;

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/audio-categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 my-4">
      <h2 className="text-xl font-semibold mb-4">Audio Categories</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="English name"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />

        <input
          type="text"
          placeholder="Swahili name"
          value={nameSw}
          onChange={(e) => setNameSw(e.target.value)}
        />

        <input
          type="text"
          placeholder="Arabic name"
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-5 py-2 rounded"
        >
          {loading
            ? editingId !== null
              ? "Updating..."
              : "Adding..."
            : editingId !== null
              ? "Update Category"
              : "Add Category"}{" "}
        </button>
      </form>

      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between border rounded p-3"
          >
            <span>{category.nameEn}</span>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(category)}
                className="text-white bg-blue-500 px-5 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(category.id)}
                className="text-white bg-red-600 px-5 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioCategoryManager;
