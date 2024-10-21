import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import './FileUploadComponent.css';

const MySwal = withReactContent(Swal);

const catGifs = [
    'https://media.tenor.com/6be0tZhr50QAAAAM/lazy-cat.gif',
    'https://media.tenor.com/WUVEKHTvdbEAAAAM/cat-black-cat.gif',
    'https://media.tenor.com/eJXzrFyI3UEAAAAM/cat-%D0%BA%D0%BE%D1%82.gif',
    'https://media.tenor.com/ruqp-QOLF1gAAAAM/cat-waiting.gif',
    'https://media.tenor.com/TFSWJKHo1LEAAAAM/waiting-patiently-on-you-i-am-bored.gif',
    'https://media.tenor.com/6be0tZhr50QAAAAM/lazy-cat.gif'
];

const FileUploadComponent = () => {
    const [files, setFiles] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [overallProgress, setOverallProgress] = useState(0);
    const [catGif, setCatGif] = useState(catGifs[0]);

    const navigate = useNavigate();

    useEffect(() => {
        if (files.length > 0) {
            setCatGif(catGifs[Math.floor(Math.random() * catGifs.length)]);
            showLoadingModal();
            handleUpload();
        }
    }, [files]);

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setFiles(Array.from(event.dataTransfer.files));
    };

    const showLoadingModal = () => {
        MySwal.fire({
            title: 'Uploading files...',
            html: `
                <img src="${catGif}" alt="Cat waiting" style="width: 100px; margin-bottom: 10px;">
                <div style="width: 100%; background: #ddd; height: 10px; margin-top: 10px;">
                    <div id="overall-progress" style="width: ${overallProgress}%; background: #4caf50; height: 100%;"></div>
                </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                MySwal.showLoading();
            }
        });
    };

    const handleUpload = () => {
        let loadedFiles = 0;
        const totalFiles = files.length;
        const newUploadedImages = [];

        files.forEach((file, index) => {
            simulateUpload(file, () => {
                const imageUrl = URL.createObjectURL(file);
                newUploadedImages.push({ name: file.name, url: imageUrl });

                loadedFiles++;
                const progressValue = (loadedFiles / totalFiles) * 100;
                setOverallProgress(progressValue);

                // Update the progress bar in SweetAlert2 modal
                const progressBar = document.getElementById('overall-progress');
                if (progressBar) {
                    progressBar.style.width = `${progressValue}%`;
                }

                if (loadedFiles === totalFiles) {
                    setTimeout(() => {
                        MySwal.close();
                        setUploadedImages(newUploadedImages);
                        // Save the images in localStorage or pass them via state
                        localStorage.setItem('uploadedImages', JSON.stringify(newUploadedImages));
                        navigate('/photos');
                    }, 500);
                }
            });
        });
    };

    const simulateUpload = (file, callback) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progress >= 100) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    };

    return (
        <div className="upload-container">
            <h1>UPLOAD PHOTOS</h1>
            <p>Upload files you want to check if it's a taken photo or not.<br />Only jpg, jpeg and png images are allowed.</p>

            <UploadBox onDrop={handleDrop} onDragOver={handleDragOver} onFileChange={handleFileChange} />
        </div>
    );
};

const UploadBox = ({ onDrop, onDragOver, onFileChange }) => (
    <div
        className="upload-box"
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => document.getElementById('fileInput').click()}
    >
        <p>Drag & Drop your files here <br /> OR</p>
        <button>Browse Files</button>
        <input
            type="file"
            id="fileInput"
            multiple
            hidden
            onChange={onFileChange}
        />
    </div>
);

export default FileUploadComponent;
