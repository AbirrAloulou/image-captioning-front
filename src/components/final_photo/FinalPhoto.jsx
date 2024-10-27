import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FinalPhoto.css';

const FinalPhoto = ({ denoisedImage, caption }) => {
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
        <div className="photo-display-container">
            <h2>Final Photo</h2>
                <div className="image-item">
                    <img src={denoisedImage} alt="denoised image" />
                    <p>{caption}</p>
                    <button onClick={handleRunAgain}>Run it again</button>
                </div>
        </div>
    );
};

export default FinalPhoto;
