import React, { useEffect, useState } from "react";

const DocumentManager = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [documents, setDocuments] = useState([]);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${API_URL}/documents`);

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const handleDocumentUpload = async (e) => {
    e.preventDefault();

    if (!documentTitle || !documentFile) {
      alert("Please provide all document details.");
      return;
    }

    const token = localStorage.getItem("access_token");

    const formData = new FormData();

    formData.append("title", documentTitle);
    // formData.append("document_type", documentType);
    formData.append("document", documentFile);

    try {
      const response = await fetch(`${API_URL}/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Backend error:", errorData);
        throw new Error(errorData.message || "Failed to upload document");
      }

      const newDocument = await response.json();

      setDocuments((prevDocuments) => [...prevDocuments, newDocument]);

      setDocumentTitle("");
      setDocumentFile(null);

      document.getElementById("document-file").value = "";
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleDocumentDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmed) {
      return;
    }
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_URL}/documents/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      setDocuments((prevDocuments) =>
        prevDocuments.filter((document) => document.id !== documentId),
      );
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };
  return (
    <>
      <section className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold">Upload Document</h2>

        <form onSubmit={handleDocumentUpload} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Document title"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
          />

          {/* <input
              type="text"
              placeholder="Document type e.g. Admission Form"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            /> */}

          <input
            id="document-file"
            type="file"
            accept=".pdf"
            onChange={(e) => setDocumentFile(e.target.files[0])}
            className="w-full"
          />

          <button
            type="submit"
            className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Upload Document
          </button>
        </form>
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Uploaded Documents</h2>

          {documents.length === 0 ? (
            <p className="mt-4 text-gray-600">No documents uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="bg-white rounded-xl shadow p-6"
                >
                  <h3 className="text-xl font-bold">{document.title}</h3>

                  {/* <p className="mt-2 text-gray-600">{document.document_type}</p> */}

                  <div className="flex gap-3 mt-5">
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      View PDF
                    </a>

                    <button
                      onClick={() => handleDocumentDelete(document.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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
export default DocumentManager;
