import React, { useEffect, useState } from "react";

const MasjidProgramManager = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [images, setImages] = useState([]);
  const [masjidPrograms, setMasjidPrograms] = useState([]);

  const [programImage, setProgramImage] = useState("");

  const [programNameEn, setProgramNameEn] = useState("");
  const [programScheduleEn, setProgramScheduleEn] = useState("");
  const [bookEn, setBookEn] = useState("");

  const [programNameSw, setProgramNameSw] = useState("");
  const [programScheduleSw, setProgramScheduleSw] = useState("");
  const [bookSw, setBookSw] = useState("");

  const [programNameAr, setProgramNameAr] = useState("");
  const [programScheduleAr, setProgramScheduleAr] = useState("");
  const [bookAr, setBookAr] = useState("");

  const [editingProgramId, setEditingProgramId] = useState(null);
  const resetProgramForm = () => {
    setEditingProgramId(null);

    setProgramImage("");

    setProgramNameEn("");
    setProgramScheduleEn("");
    setBookEn("");

    setProgramNameSw("");
    setProgramScheduleSw("");
    setBookSw("");

    setProgramNameAr("");
    setProgramScheduleAr("");
    setBookAr("");
  };
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}/images`);

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [API_URL]);

  useEffect(() => {
    const fetchMasjidPrograms = async () => {
      try {
        const response = await fetch(`${API_URL}/masjid-programs/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Masjid programs");
        }

        const data = await response.json();
        setMasjidPrograms(data);
      } catch (error) {
        console.error("Error fetching Masjid programs:", error);
      }
    };

    fetchMasjidPrograms();
  }, [API_URL]);
  const handleAddProgram = async (e) => {
    e.preventDefault();

    if (
      !programImage ||
      !programNameEn ||
      !programScheduleEn ||
      !programNameSw ||
      !programScheduleSw ||
      !programNameAr ||
      !programScheduleAr
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("access_token");

    const programData = {
      image_id: Number(programImage),

      program_name_en: programNameEn,
      program_schedule_en: programScheduleEn,
      book_en: bookEn,

      program_name_sw: programNameSw,
      program_schedule_sw: programScheduleSw,
      book_sw: bookSw,

      program_name_ar: programNameAr,
      program_schedule_ar: programScheduleAr,
      book_ar: bookAr,
    };

    try {
      const response = await fetch(
        editingProgramId
          ? `${API_URL}/masjid-programs/${editingProgramId}`
          : `${API_URL}/masjid-programs`,
        {
          method: editingProgramId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(programData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();

        console.log("Backend error:", errorData);

        throw new Error(errorData.message || "Failed to add Masjid program");
      }

      const data = await response.json();

      console.log("Program added:", data);
      if (editingProgramId) {
        setMasjidPrograms((currentPrograms) =>
          currentPrograms.map((program) =>
            program.id === editingProgramId
              ? {
                  ...program,
                  image:
                    images.find((image) => image.id === Number(programImage)) ||
                    program.image,
                  translations: {
                    en: {
                      program_name: programNameEn,
                      program_schedule: programScheduleEn,
                      book: bookEn,
                    },
                    sw: {
                      program_name: programNameSw,
                      program_schedule: programScheduleSw,
                      book: bookSw,
                    },
                    ar: {
                      program_name: programNameAr,
                      program_schedule: programScheduleAr,
                      book: bookAr,
                    },
                  },
                }
              : program,
          ),
        );
      }
      alert(
        editingProgramId
          ? "Masjid program updated successfully."
          : "Masjid program added successfully.",
      );
      resetProgramForm();
    } catch (error) {
      console.error("Error adding Masjid program:", error);
    }
  };

  const handleDeleteProgram = async (programId) => {
    const token = localStorage.getItem("access_token");

    const confirmed = window.confirm(
      "Are you sure you want to delete this program?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/masjid-programs/${programId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete program");
      }

      setMasjidPrograms((currentPrograms) =>
        currentPrograms.filter((program) => program.id !== programId),
      );

      alert("Program deleted successfully.");
    } catch (error) {
      console.error("Error deleting program:", error);
      alert(error.message);
    }
  };

  const handleEditProgram = (program) => {
    setEditingProgramId(program.id);

    setProgramImage(program.image?.id?.toString() || "");

    setProgramNameEn(program.translations.en?.program_name || "");
    setProgramScheduleEn(program.translations.en?.program_schedule || "");
    setBookEn(program.translations.en?.book || "");

    setProgramNameSw(program.translations.sw?.program_name || "");
    setProgramScheduleSw(program.translations.sw?.program_schedule || "");
    setBookSw(program.translations.sw?.book || "");

    setProgramNameAr(program.translations.ar?.program_name || "");
    setProgramScheduleAr(program.translations.ar?.program_schedule || "");
    setBookAr(program.translations.ar?.book || "");
  };

  return (
    <section className="mt-10 bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold">Masjid Programs</h2>

      <form onSubmit={handleAddProgram} className="mt-6">
        {/* Program Image */}
        <div>
          <label className="block font-semibold mb-2">Program Image</label>

          <select
            value={programImage}
            onChange={(e) => setProgramImage(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="">Select an image</option>

            {images.map((image) => (
              <option key={image.id} value={image.id}>
                {image.title}
              </option>
            ))}
          </select>
        </div>

        {/* English */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">English</h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Program name"
              value={programNameEn}
              onChange={(e) => setProgramNameEn(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="Program schedule"
              value={programScheduleEn}
              onChange={(e) => setProgramScheduleEn(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="Book (optional)"
              value={bookEn}
              onChange={(e) => setBookEn(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>

        {/* Kiswahili */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Kiswahili</h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Jina la programu"
              value={programNameSw}
              onChange={(e) => setProgramNameSw(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="Ratiba ya programu"
              value={programScheduleSw}
              onChange={(e) => setProgramScheduleSw(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="Kitabu (hiari)"
              value={bookSw}
              onChange={(e) => setBookSw(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>

        {/* Arabic */}
        <div className="mt-8" dir="rtl">
          <h3 className="text-xl font-bold mb-4">العربية</h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="اسم البرنامج"
              value={programNameAr}
              onChange={(e) => setProgramNameAr(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="جدول البرنامج"
              value={programScheduleAr}
              onChange={(e) => setProgramScheduleAr(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="الكتاب (اختياري)"
              value={bookAr}
              onChange={(e) => setBookAr(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          onClick={resetProgramForm}
          className="mt-8 bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          {editingProgramId ? "Update Masjid Program" : "Add Masjid Program"}
        </button>
      </form>
      {editingProgramId && (
        <button
          type="button"
          onClick={() => {
           resetProgramForm();
          }}
          className="ml-3 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Cancel Edit
        </button>
      )}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-6">Existing Masjid Programs</h3>

        {masjidPrograms.length === 0 ? (
          <p className="text-gray-500">No Masjid programs found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {masjidPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-gray-50 rounded-xl shadow p-5"
              >
                {program.image && (
                  <img
                    src={program.image.url}
                    alt={program.translations.en?.program_name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <h4 className="text-xl font-bold mt-4">
                  {program.translations.en?.program_name}
                </h4>

                <p className="mt-2 text-gray-600">
                  {program.translations.en?.program_schedule}
                </p>

                {program.translations.en?.book && (
                  <p className="mt-2 text-gray-600">
                    Book: {program.translations.en.book}
                  </p>
                )}
                <div className="flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => handleEditProgram(program)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProgram(program.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MasjidProgramManager;
