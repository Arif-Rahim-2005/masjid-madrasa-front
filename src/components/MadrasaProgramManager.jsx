import React, { useState, useEffect } from "react";

const MadrasaProgramManager = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const [programImage, setProgramImage] = useState("");
  const [programCategory, setProgramCategory] = useState("");

  const [programNameEn, setProgramNameEn] = useState("");
  const [subjectsEn, setSubjectsEn] = useState("");
  const [programScheduleEn, setProgramScheduleEn] = useState("");

  const [programNameSw, setProgramNameSw] = useState("");
  const [subjectsSw, setSubjectsSw] = useState("");
  const [programScheduleSw, setProgramScheduleSw] = useState("");

  const [programNameAr, setProgramNameAr] = useState("");
  const [subjectsAr, setSubjectsAr] = useState("");
  const [programScheduleAr, setProgramScheduleAr] = useState("");

    const [editingProgramId, setEditingProgramId] = useState(null);
    

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
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${API_URL}/madrasa-program-categories/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_URL}/madrasa-programs?language=en`);

        if (!response.ok) {
          throw new Error("Failed to fetch Madrasa programs");
        }

        const data = await response.json();
        setPrograms(data);
      } catch (error) {
        console.error("Error fetching Madrasa programs:", error);
      }
    };

    fetchPrograms();
  }, [API_URL]);
 const handleSubmit = async (e) => {
   e.preventDefault();

   try {
     const token = localStorage.getItem("access_token");

     const url = editingProgramId
       ? `${API_URL}/madrasa-programs/${editingProgramId}`
       : `${API_URL}/madrasa-programs`;

     const method = editingProgramId ? "PATCH" : "POST";

     const response = await fetch(url, {
       method,
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       },
       body: JSON.stringify({
         image_id: Number(programImage),
         category_id: Number(programCategory),

         name_en: programNameEn,
         schedule_en: programScheduleEn,
         subjects_en: subjectsEn,

         name_sw: programNameSw,
         schedule_sw: programScheduleSw,
         subjects_sw: subjectsSw,

         name_ar: programNameAr,
         schedule_ar: programScheduleAr,
         subjects_ar: subjectsAr,
       }),
     });

     if (!response.ok) {
       const errorData = await response.json();
       console.error(errorData);
       throw new Error("Failed to save Madrasa program");
     }

     window.location.reload();
   } catch (error) {
     console.error("Error saving Madrasa program:", error);
   }
 };
    
  const handleDelete = async (programId) => {
    try {
      const token = localStorage.getItem("access_token");
      const confirmed = window.confirm(
        "Are you sure you want to delete this program?",
      );

      if (!confirmed) {
        return;
      }

      const response = await fetch(`${API_URL}/madrasa-programs/${programId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete program");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  };
const handleEdit = async (program) => {
  try {
    const languages = ["en", "sw", "ar"];

    const responses = await Promise.all(
      languages.map((language) =>
        fetch(`${API_URL}/madrasa-programs?language=${language}`),
      ),
    );

    const data = await Promise.all(
      responses.map((response) => response.json()),
    );

    const english = data[0].find(
      (item) => item.program_id === program.program_id,
    );

    const swahili = data[1].find(
      (item) => item.program_id === program.program_id,
    );

    const arabic = data[2].find(
      (item) => item.program_id === program.program_id,
    );

    setEditingProgramId(program.program_id);

    setProgramImage(program.image?.id || "");
    setProgramCategory(program.category_id);

    setProgramNameEn(english?.program_name || "");
    setSubjectsEn(english?.subjects || "");
    setProgramScheduleEn(english?.schedule || "");

    setProgramNameSw(swahili?.program_name || "");
    setSubjectsSw(swahili?.subjects || "");
    setProgramScheduleSw(swahili?.schedule || "");

    setProgramNameAr(arabic?.program_name || "");
    setSubjectsAr(arabic?.subjects || "");
    setProgramScheduleAr(arabic?.schedule || "");
  } catch (error) {
    console.error("Error loading program for edit:", error);
  }
};
    
    
  return (
    <>
      <section className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold">Madrasa Programs</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mt-6">
            <label className="block font-semibold mb-2">Program Category</label>

            <select
              value={programCategory}
              onChange={(e) => setProgramCategory(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.translations.en?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6">
            <label className="block font-semibold mb-2">
              Program Name (English)
            </label>

            <input
              type="text"
              value={programNameEn}
              onChange={(e) => setProgramNameEn(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Program name"
            />
          </div>

          <div className="mt-6">
            <label className="block font-semibold mb-2">
              Subjects (English)
            </label>

            <input
              type="text"
              value={subjectsEn}
              onChange={(e) => setSubjectsEn(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Subjects"
            />
          </div>

          <div className="mt-6">
            <label className="block font-semibold mb-2">
              Schedule (English)
            </label>

            <input
              type="text"
              value={programScheduleEn}
              onChange={(e) => setProgramScheduleEn(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Program schedule"
            />
          </div>
          <div className="mt-6">
            <label className="block font-semibold mb-2">
              Program Name (Kiswahili)
            </label>

            <input
              type="text"
              value={programNameSw}
              onChange={(e) => setProgramNameSw(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Jina la programu"
            />
          </div>

          <div className="mt-6">
            <label className="block font-semibold mb-2">
              Subjects (Kiswahili)
            </label>

            <input
              type="text"
              value={subjectsSw}
              onChange={(e) => setSubjectsSw(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Masomo"
            />
          </div>

          <div className="mt-6">
            <label className="block font-semibold mb-2">
              Schedule (Kiswahili)
            </label>

            <input
              type="text"
              value={programScheduleSw}
              onChange={(e) => setProgramScheduleSw(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Ratiba ya programu"
            />
          </div>
          <div className="mt-6">
            <label className="block font-semibold mb-2">
              Program Name (Arabic)
            </label>

            <input
              type="text"
              value={programNameAr}
              onChange={(e) => setProgramNameAr(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="اسم البرنامج"
            />
          </div>

          <div className="mt-6">
            <label className="block font-semibold mb-2">
              Subjects (Arabic)
            </label>

            <input
              type="text"
              value={subjectsAr}
              onChange={(e) => setSubjectsAr(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="المواد"
            />
          </div>

          <div className="mt-6">
            <label className="block font-semibold mb-2">
              Schedule (Arabic)
            </label>

            <input
              type="text"
              value={programScheduleAr}
              onChange={(e) => setProgramScheduleAr(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="جدول البرنامج"
            />
          </div>
          <button
            type="submit"
            className="mt-6 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {editingProgramId ? "Update Program" : "Add Program"}{" "}
          </button>
        </form>
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Existing Madrasa Programs</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program.program_id}
                className="border rounded-xl p-4 bg-gray-50"
              >
                <h4 className="text-lg font-bold">{program.program_name}</h4>

                <p className="mt-2">
                  <strong>Subjects:</strong> {program.subjects}
                </p>

                <p className="mt-2">
                  <strong>Schedule:</strong> {program.schedule}
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(program.program_id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(program)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default MadrasaProgramManager;
