import React, { useEffect, useState } from "react";

const AnnouncementManager = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [announcements, setAnnouncements] = useState([]);
  const [images, setImages] = useState([]);

  const [announcementImage, setAnnouncementImage] = useState("");

  const [titleEn, setTitleEn] = useState("");
  const [contentEn, setContentEn] = useState("");

  const [titleSw, setTitleSw] = useState("");
  const [contentSw, setContentSw] = useState("");

  const [titleAr, setTitleAr] = useState("");
  const [contentAr, setContentAr] = useState("");

  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
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
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${API_URL}/announcements?language=en`);

        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }

        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");

      const url = editingAnnouncementId
        ? `${API_URL}/announcements/${editingAnnouncementId}`
        : `${API_URL}/announcements`;

      const method = editingAnnouncementId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_id: announcementImage ? Number(announcementImage) : null,

          title_en: titleEn,
          content_en: contentEn,

          title_sw: titleSw,
          content_sw: contentSw,

          title_ar: titleAr,
          content_ar: contentAr,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error("Failed to create announcement");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_URL}/announcements/${announcementId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error("Failed to delete announcement");
      }

      setAnnouncements((prev) =>
        prev.filter(
          (announcement) => announcement.announcement_id !== announcementId,
        ),
      );
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleEditAnnouncement = async (announcement) => {
    try {
      const languages = ["en", "sw", "ar"];

      const responses = await Promise.all(
        languages.map((language) =>
          fetch(`${API_URL}/announcements?language=${language}`),
        ),
      );

      const data = await Promise.all(
        responses.map((response) => response.json()),
      );

      const english = data[0].find(
        (item) => item.announcement_id === announcement.announcement_id,
      );

      const swahili = data[1].find(
        (item) => item.announcement_id === announcement.announcement_id,
      );

      const arabic = data[2].find(
        (item) => item.announcement_id === announcement.announcement_id,
      );

      setEditingAnnouncementId(announcement.announcement_id);

      setAnnouncementImage(announcement.image_id || "");

      setTitleEn(english?.title || "");
      setContentEn(english?.content || "");

      setTitleSw(swahili?.title || "");
      setContentSw(swahili?.content || "");

      setTitleAr(arabic?.title || "");
      setContentAr(arabic?.content || "");
    } catch (error) {
      console.error("Error loading announcement for edit:", error);
    }
  };

  return (
    <section className="mt-10 bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold">Announcements</h2>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mt-6">
          <label className="block font-semibold mb-2">Announcement Image</label>

          <select
            value={announcementImage}
            onChange={(e) => setAnnouncementImage(e.target.value)}
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
          <label className="block font-semibold mb-2">Title (English)</label>

          <input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Announcement title"
          />
        </div>

        <div className="mt-6">
          <label className="block font-semibold mb-2">Content (English)</label>

          <textarea
            value={contentEn}
            onChange={(e) => setContentEn(e.target.value)}
            rows="4"
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Announcement content"
          />
        </div>
        <div className="mt-6">
          <label className="block font-semibold mb-2">Title (Kiswahili)</label>

          <input
            type="text"
            value={titleSw}
            onChange={(e) => setTitleSw(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Kichwa cha tangazo"
          />
        </div>

        <div className="mt-6">
          <label className="block font-semibold mb-2">
            Content (Kiswahili)
          </label>

          <textarea
            value={contentSw}
            onChange={(e) => setContentSw(e.target.value)}
            rows="4"
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Maudhui ya tangazo"
          />
        </div>
        <div className="mt-6" dir="rtl">
          <label className="block font-semibold mb-2">Title (Arabic)</label>

          <input
            type="text"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="عنوان الإعلان"
          />
        </div>

        <div className="mt-6" dir="rtl">
          <label className="block font-semibold mb-2">Content (Arabic)</label>

          <textarea
            value={contentAr}
            onChange={(e) => setContentAr(e.target.value)}
            rows="4"
            className="w-full border rounded-lg px-4 py-3"
            placeholder="محتوى الإعلان"
          />
        </div>
        <button
          type="submit"
          className="mt-6 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {editingAnnouncementId ? "Update Announcement" : "Add Announcement"}
        </button>
      </form>
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Existing Announcements</h2>

        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements found.</p>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.announcement_id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <h3 className="text-lg font-semibold">{announcement.title}</h3>

              <p className="mt-2 text-gray-600">{announcement.content}</p>

              <button
                type="button"
                onClick={() =>
                  handleDeleteAnnouncement(announcement.announcement_id)
                }
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded mx-1"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => handleEditAnnouncement(announcement)}
                className="bg-blue-600 text-white px-4 py-2 rounded mx-1"
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default AnnouncementManager;
