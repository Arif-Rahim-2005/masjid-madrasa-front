import React, { useEffect, useState } from "react";

const MadrasaCategoryManager = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [categories, setCategories] = useState([]);

  const [monthlyFee, setMonthlyFee] = useState("");

  const [categoryNameEn, setCategoryNameEn] = useState("");
  const [categoryNameSw, setCategoryNameSw] = useState("");
  const [categoryNameAr, setCategoryNameAr] = useState("");

  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);

    setMonthlyFee(category.monthly_fee.toString());

    setCategoryNameEn(category.translations.en?.name || "");
    setCategoryNameSw(category.translations.sw?.name || "");
    setCategoryNameAr(category.translations.ar?.name || "");
  };
  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${API_URL}/madrasa-program-categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories((currentCategories) =>
        currentCategories.filter((category) => category.id !== categoryId),
      );

      alert("Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.message);
    }
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!monthlyFee || !categoryNameEn || !categoryNameSw || !categoryNameAr) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("access_token");

    const categoryData = {
      monthly_fee: Number(monthlyFee),

      name_en: categoryNameEn,
      name_sw: categoryNameSw,
      name_ar: categoryNameAr,
    };

    try {
      const response = await fetch(
        editingCategoryId
          ? `${API_URL}/madrasa-program-categories/${editingCategoryId}`
          : `${API_URL}/madrasa-program-categories`,
        {
          method: editingCategoryId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add category");
      }

      alert("Category added successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error adding category:", error);
      alert(error.message);
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${API_URL}/madrasa-program-categories/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [API_URL]);

  return (
    <section className="mt-10 bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold">Madrasa Program Categories</h2>

      <form onSubmit={handleAddCategory} className="mt-6">
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">English</h3>

          <input
            type="text"
            value={categoryNameEn}
            onChange={(e) => setCategoryNameEn(e.target.value)}
            placeholder="Category name"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Kiswahili</h3>

          <input
            type="text"
            value={categoryNameSw}
            onChange={(e) => setCategoryNameSw(e.target.value)}
            placeholder="Jina la kategoria"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>
        <div className="mt-8" dir="rtl">
          <h3 className="text-xl font-bold mb-4">العربية</h3>

          <input
            type="text"
            value={categoryNameAr}
            onChange={(e) => setCategoryNameAr(e.target.value)}
            placeholder="اسم الفئة"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>
        <div className="mt-8">
          <label className="block font-semibold mb-2">Monthly Fee</label>

          <input
            type="number"
            step="0.01"
            value={monthlyFee}
            onChange={(e) => setMonthlyFee(e.target.value)}
            placeholder="Monthly fee"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            {editingCategoryId ? "Update Category" : "Add Category"}{" "}
          </button>
        </div>
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingCategoryId(null);
              setMonthlyFee("");
              setCategoryNameEn("");
              setCategoryNameSw("");
              setCategoryNameAr("");
            }}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            {editingCategoryId ? "Cancel Edit" : "Clear"}
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-6">Existing Categories</h3>
        {categories.map((category) => (
          <div key={category.id} className="bg-gray-50 rounded-xl shadow p-5">
            <h4 className="text-xl font-bold">
              {category.translations.en?.name}
            </h4>

            <p className="mt-2 text-gray-600">
              Kiswahili: {category.translations.sw?.name}
            </p>

            <p className="mt-2 text-gray-600">
              Arabic: {category.translations.ar?.name}
            </p>

            <p className="mt-2 text-gray-600">
              Monthly Fee: {category.monthly_fee}
            </p>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => handleEditCategory(category)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDeleteCategory(category.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MadrasaCategoryManager;
