import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotPhoto.css';

const NotPhoto = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const images = JSON.parse(localStorage.getItem('uploadedImages'));
        if (images) {
            setUploadedImages(images);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <div className="photo-display-container">
            <h2>Uploaded Photos</h2>
            <div className="photo-display">
                {uploadedImages.map((image, index) => (
                    <div key={index} className="image-item">
                        <img src={image.url} alt={image.name} />
                        <p>What you uploaded is not a photo</p>
                        <button onClick={handleReturnHome()}>Return Home</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotPhoto;
