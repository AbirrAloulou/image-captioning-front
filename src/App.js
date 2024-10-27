import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PhotoDisplay from './components/photo_display/PhotoDisplay';
import FileUploadComponent from './components/file_upload/FileUploadComponent';
import NotPhoto from './components/not_photo/NotPhoto';
import Captioning from './components/captioning/Captioning';
import FinalPhoto from './components/final_photo/FinalPhoto';

function App() {
  const [denoisedImage, setDenoisedImage] = useState(null);
  const [caption, setCaption] = useState(null);
  const [probability, setProbability] = useState(null);

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUploadComponent setProbability={setProbability}/>} />
        <Route path="/photos" element={<PhotoDisplay setDenoisedImage={setDenoisedImage} probability={probability} />} />
        {/* classification  */}
        <Route path="/notaphoto" element={<NotPhoto />} />
        <Route path="/captioning" element={<Captioning denoisedImage={denoisedImage} setCaption={setCaption} />} />
        {/* Denoised */}
        <Route path="/final-photo" element={<FinalPhoto denoisedImage={denoisedImage} caption={caption}/>} />
        {/* generated caption  */}
      </Routes>
    </Router>
  );
}

export default App;
