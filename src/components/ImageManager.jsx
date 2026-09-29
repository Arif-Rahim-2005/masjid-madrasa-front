import React, { useEffect, useState } from "react";

const ImageManager = ({ imageId, onImageChange }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
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
  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !file) {
      alert("Please provide a title and image.");
      return;
    }

    const token = localStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", file);

    try {
      const response = await fetch(`${API_URL}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const newImage = await response.json();

      await fetchImages();
      setTitle("");
      setFile(null);

      document.getElementById("image-file").value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleDelete = async (imageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?",
    );

    if (!confirmed) {
      return;
    }
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_URL}/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setImages((prevImages) =>
        prevImages.filter((image) => image.id !== imageId),
      );
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  return (
    <>
      <section className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold">Upload Image</h2>

        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Image title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            id="image-file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />

          <button
            type="submit"
            className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Upload Image
          </button>
        </form>
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Uploaded Images</h2>

          {images.length === 0 ? (
            <p className="mt-4 text-gray-600">No images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-xl shadow overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{image.title}</h3>

                    <button
                      onClick={() => handleDelete(image.id)}
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </>
  );
};
export default ImageManager;
