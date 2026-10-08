import ImageManager from "../components/ImageManager";
import DocumentManager from "../components/DocumentManager";
import MasjidProgramManager from "../components/MasjidProgramManager";
import MadrasaCategoryManager from "../components/MadrasaCategoryManager";
import MadrasaProgramManager from "../components/MadrasaProgramManager";
import AnnouncementManager from "../components/AnnouncementManager";
import AudioCategoryManager from "../components/AudioCategoryManager";
import AudioSeriesManager from "../components/AudioSeriesManager";
import AudioRecordingManager from "../components/AudioRecordingManager";

const AdminPanel = () => {
  return (
    <main className="min-h-screen bg-gray-100 text-green-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-gray-600">
          Manage Masjid and Madrasatul Khairat Al-Islamiyyah
        </p>
        <ImageManager />
        <DocumentManager />
        <MasjidProgramManager />
        <MadrasaCategoryManager />
        <MadrasaProgramManager />
        <AnnouncementManager />
        <AudioCategoryManager />
        <AudioSeriesManager />
        <AudioRecordingManager />
      </div>
    </main>
  );
};

export default AdminPanel;
