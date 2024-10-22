import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import './Captionizing.css';

const MySwal = withReactContent(Swal);

const catGifs = [
    'https://media.tenor.com/6be0tZhr50QAAAAM/lazy-cat.gif',
    'https://media.tenor.com/WUVEKHTvdbEAAAAM/cat-black-cat.gif',
    'https://media.tenor.com/eJXzrFyI3UEAAAAM/cat-%D0%BA%D0%BE%D1%82.gif',
    'https://media.tenor.com/ruqp-QOLF1gAAAAM/cat-waiting.gif',
    'https://media.tenor.com/TFSWJKHo1LEAAAAM/waiting-patiently-on-you-i-am-bored.gif',
];

const Captionizing = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [catGif, setCatGif] = useState(catGifs[0]);
    const navigate = useNavigate();

    useEffect(() => {
        const images = JSON.parse(localStorage.getItem('uploadedImages'));
        if (images && images.length > 0) {
            setUploadedImages(images);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const showGeneratingModal = () => {
        const gif = catGifs[Math.floor(Math.random() * catGifs.length)];
        setCatGif(gif);

        MySwal.fire({
            title: 'Generating legend...',
            html: `
                <img src="${gif}" alt="Cat waiting" style="width: 100px; margin-bottom: 10px;">
                <div style="width: 100%; background: #ddd; height: 10px; margin-top: 10px;">
                    <div id="progress-bar" style="width: 0%; background: #4caf50; height: 100%;"></div>
                </div>
            `,
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
                        navigate('/final-photo');
                    }
                }, 100);
            }
        });
    };

    return (
        <div className="photo-display-container-caption">
            <h2>Uploaded Photos</h2>
            <div className="photo-display">
                {uploadedImages.length > 0 && uploadedImages.map((image, index) => (
                    <div key={index} className="image-item-caption">
                        <div className="image-pair">
                            <img src={image.url} alt={image.name} />
                            <img src={image.url} alt={image.name} />
                        </div>
                        <button onClick={showGeneratingModal}>Captionizing</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Captionizing;