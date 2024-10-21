import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FinalPhoto.css';

const FinalPhoto = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const images = JSON.parse(localStorage.getItem('uploadedImages'));
        if (images && images.length > 0) {
            setUploadedImages(images);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleRunAgain = () => {
        navigate('/');
    };

    return (
        <div className="final-photo-container">
            <h2>Final Photo</h2>
            {uploadedImages.length > 0 && (
                <div className="image-item">
                    <img src={uploadedImages[0].url} alt={uploadedImages[0].name} />
                    <p>Generated Caption</p>
                    <button onClick={handleRunAgain}>Run it again</button>
                </div>
            )}
        </div>
    );
};

export default FinalPhoto;
