import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PhotoDisplay from './components/photo_display/PhotoDisplay';
import FileUploadComponent from './components/file_upload/FileUploadComponent';
import NotPhoto from './components/not_photo/NotPhoto';
import Captionizing from './components/captionizing/Captionizing';
import FinalPhoto from './components/final_photo/FinalPhoto';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUploadComponent />} />
        <Route path="/photos" element={<PhotoDisplay />} />
        <Route path="/notaphoto" element={<NotPhoto />} />
        <Route path="/captionizing" element={<Captionizing />} />
        <Route path="/final-photo" element={<FinalPhoto />} />
      </Routes>
    </Router>
  );
}

export default App;
