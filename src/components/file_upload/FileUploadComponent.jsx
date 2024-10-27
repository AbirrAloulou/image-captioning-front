import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import './FileUploadComponent.css';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const catGifs = [
    'https://media.tenor.com/6be0tZhr50QAAAAM/lazy-cat.gif',
    'https://media.tenor.com/WUVEKHTvdbEAAAAM/cat-black-cat.gif',
    'https://media.tenor.com/eJXzrFyI3UEAAAAM/cat-%D0%BA%D0%BE%D1%82.gif',
    'https://media.tenor.com/ruqp-QOLF1gAAAAM/cat-waiting.gif',
    'https://media.tenor.com/TFSWJKHo1LEAAAAM/waiting-patiently-on-you-i-am-bored.gif',
    'https://media.tenor.com/6be0tZhr50QAAAAM/lazy-cat.gif'
];

const FileUploadComponent = ({setProbability}) => {
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
            html: (
                <>
                    <img src={catGif} alt="Cat waiting" style={{ width: '100px', marginBottom: '10px' }} />
                    <div style={{ width: '100%', background: '#ddd', height: '10px', marginTop: '10px' }}>
                        <div style={{ width: `${overallProgress}%`, background: '#4caf50', height: '100%' }}></div>
                    </div>
                </>
            ),
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                MySwal.showLoading();
            }
        });
    };

    const handleUpload = () => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file);
        });

        axios.post('http://127.0.0.1:5000/classify', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const progressValue = (progressEvent.loaded / progressEvent.total) * 100;
                setOverallProgress(progressValue);
            },
        })
        .then(response => {
            MySwal.close();
            if (response.data.is_photo) {
                // Navigate to the photo display interface
                setProbability(response.data.probability);
                const uploadedData = [{ name: files[0].name, url: URL.createObjectURL(files[0]) }];
                setUploadedImages(uploadedData);
                localStorage.setItem('uploadedImages', JSON.stringify(uploadedData));
                navigate('/photos');
            } else {
                Swal.fire({
                    title: 'Not a Photo',
                    text: 'The uploaded file is not recognized as a photo with a probability of : ' + (response.data.probability* 100).toFixed(2) +'%',
                    icon: 'warning',
                }).then(() => {
                    setFiles([]); // Reset the files state to allow for a new upload
                });
            }
        })
        .catch(error => {
            console.error("Error uploading the file", error);
            Swal.fire({
                title: 'Upload Failed',
                text: 'There was an error uploading your file. Please try again.',
                icon: 'error',
            });
        });
    };

    return (
        <div className="upload-container">
            <h1>UPLOAD A PHOTO</h1>
            <p>Upload the photo you want to check if it's a taken photo or not.<br />Only jpg, jpeg and png images are allowed.</p>

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
        <p>Drag & Drop your photo here <br /> OR</p>
        <button>Browse Files</button>
        <input
            type="file"
            id="fileInput"
            accept="image/jpeg, image/png"
            hidden
            onChange={onFileChange}
        />
    </div>
);

export default FileUploadComponent;
