// PhotoDisplay.js
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import './PhotoDisplay.css';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const catGifs = [
    'https://media.tenor.com/6be0tZhr50QAAAAM/lazy-cat.gif',
    'https://media.tenor.com/WUVEKHTvdbEAAAAM/cat-black-cat.gif',
    'https://media.tenor.com/eJXzrFyI3UEAAAAM/cat-%D0%BA%D0%BE%D1%82.gif',
    'https://media.tenor.com/ruqp-QOLF1gAAAAM/cat-waiting.gif',
    'https://media.tenor.com/TFSWJKHo1LEAAAAM/waiting-patiently-on-you-i-am-bored.gif',
];

const PhotoDisplay = ({ setDenoisedImage, probability }) => {
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

    const handleDenoising = async (image) => {
        const gif = catGifs[Math.floor(Math.random() * catGifs.length)];
        const formData = new FormData();
    
        // Fetch the actual file from the image object or input source
        const response = await fetch(image.url);
        const blob = await response.blob();
        const file = new File([blob], image.name, { type: blob.type });
    
        // Append the file correctly with the name 'file'
        formData.append('file', file);
    
        try {
            const response = await axios.post('http://localhost:5000/denoise', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob',
            });
    
            const denoisedImageUrl = URL.createObjectURL(response.data);
            setDenoisedImage(denoisedImageUrl);
            MySwal.close();
        } catch (error) {
            console.error("Error denoising the image", error);
            Swal.fire({
                title: 'Denoising Failed',
                text: 'There was an error denoising your image. Please try again.',
                icon: 'error',
            });
        }
    
        MySwal.fire({
            title: 'Denoising image...',
            html: `<img src="${gif}" alt="Cat waiting" style="width: 100px; margin-bottom: 10px;">`,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                const progressBar = document.getElementById('progress-bar');
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 5;
                    if (progressBar) {
                        progressBar.style.width = `${progress}%`;
                    }
    
                    if (progress >= 100) {
                        clearInterval(interval);
                        MySwal.close();
                        navigate('/captioning');
                    }
                }, 100);
            }
        });
    };
    

    return (
        <div className="photo-display-container">
            <h2>Uploaded Photo</h2>
            <div className="photo-display">
                {uploadedImages.map((image, index) => (
                    <div key={index} className="image-item">
                        <img src={image.url} alt={image.name} width='50' />
                        {probability !== null && (
                            <p>Probability: {(probability * 100).toFixed(2)}%</p>
                        )}
                        <button onClick={() => handleDenoising(image)}>Denoising</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoDisplay;
