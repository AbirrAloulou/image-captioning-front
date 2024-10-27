import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import './Captioning.css';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const catGifs = [
    'https://media.tenor.com/6be0tZhr50QAAAAM/lazy-cat.gif',
    'https://media.tenor.com/WUVEKHTvdbEAAAAM/cat-black-cat.gif',
    'https://media.tenor.com/eJXzrFyI3UEAAAAM/cat-%D0%BA%D0%BE%D1%82.gif',
    'https://media.tenor.com/ruqp-QOLF1gAAAAM/cat-waiting.gif',
    'https://media.tenor.com/TFSWJKHo1LEAAAAM/waiting-patiently-on-you-i-am-bored.gif',
];

const Captioning = ({ denoisedImage, setCaption }) => {
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

    // const showGeneratingModal = () => {
    //     const gif = catGifs[Math.floor(Math.random() * catGifs.length)];
    //     setCatGif(gif);

    //     MySwal.fire({
    //         title: 'Generating legend...',
    //         html: `
    //             <img src="${gif}" alt="Cat waiting" style="width: 100px; margin-bottom: 10px;">
    //             <div style="width: 100%; background: #ddd; height: 10px; margin-top: 10px;">
    //                 <div id="progress-bar" style="width: 0%; background: #4caf50; height: 100%;"></div>
    //             </div>
    //         `,
    //         showConfirmButton: false,
    //         allowOutsideClick: false,
    //         allowEscapeKey: false,
    //         didOpen: () => {
    //             const progressBar = document.getElementById('progress-bar');
    //             let progress = 0;
    //             const interval = setInterval(() => {
    //                 progress += 5;
    //                 if (progressBar) {
    //                     progressBar.style.width = `${progress}%`;
    //                 }

    //                 if (progress >= 100) {
    //                     clearInterval(interval);
    //                     MySwal.close();
    //                 }
    //             }, 100);
    //         }
    //     });
    // };

    // const handleCaptioning = async (image) => {
    //     console.log("now normally captioning")
    //     // Show the generating modal
    //     showGeneratingModal();

    //     try {
    //         // Create a FormData object to send the image file to the backend
    //         const formData = new FormData();
    //         console.log(formData);

    //         const response = await fetch(image.url);
    //         console.log(response);
    //         const blob = await response.blob();
    //         formData.append('file', blob, response);

    //         // Send the image to the captioning endpoint
    //         const result = await axios.post('http://localhost:5000/caption', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         console.log(result.data.caption);

    //         // If the request is successful, extract the caption and display it
    //         if (result.data.caption) {
    //             console.log(result.data.caption);
    //             // Close the modal after the caption is generated
    //             MySwal.close();

    //             // Show the caption and denoised image in a Swal modal
    //             MySwal.fire({
    //                 title: 'Caption Generated',
    //                 html: `
    //                     <img src="${denoisedImage}" alt="Denoised" style="width: 100%; margin-bottom: 10px;">
    //                     <p>${result.data.caption}</p>
    //                 `,
    //                 confirmButtonText: 'Close'
    //             });
    //         } else {
    //             throw new Error('Caption not available');
    //         }
    //     } catch (error) {
    //         console.error('Error generating caption:', error);
    //         MySwal.fire({
    //             title: 'Error',
    //             text: 'An error occurred while generating the caption. Please try again.',
    //             icon: 'error',
    //             confirmButtonText: 'Close'
    //         });
    //     }
    // };

    const handleCaptioning = async (denoisedImage) => {
        const gif = catGifs[Math.floor(Math.random() * catGifs.length)];
        const formData = new FormData();

        try {
            // Fetch the actual file from the denoised image URL
            const response = await fetch(denoisedImage);
            const blob = await response.blob();
            const file = new File([blob], 'denoised_image.jpg', { type: blob.type });

            // Append the file correctly with the name 'file'
            formData.append('file', file);

            // Send the image to the captioning endpoint
            const result = await axios.post('http://localhost:5000/caption', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Parse the JSON response and get the caption
            const caption = result.data.caption;
            console.log("Generated Caption:", caption);
            setCaption(caption); // Update your state or component with the caption
            MySwal.close();
        } catch (error) {
            console.error("Error captioning the image", error);
            Swal.fire({
                title: 'Captioning Failed',
                text: 'There was an error captioning your image. Please try again.',
                icon: 'error',
            });
        }

        MySwal.fire({
            title: 'Captioning image...',
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
                        navigate('/final-photo');
                    }
                }, 100);
            }
        });
    };



    return (
        <div className="captioning-container">
            <h2>Uploaded Photos</h2>
            <div className="photo-display">
                {uploadedImages.length > 0 && uploadedImages.map((image, index) => (
                    <div key={index} className="image-item-caption">
                        <div className="image-pair">
                            <div className='single-image'>
                                <img src={image.url} alt="Original" className="original-image" />
                                <p>Original photo</p>
                            </div>
                            <div className='single-image'>
                                {denoisedImage ? (
                                    <img src={denoisedImage} alt="Denoised" className="denoised-image" />

                                ) : (
                                    <p>No denoised image available</p>
                                )}
                                <p>Denoised photo</p>
                            </div>
                        </div>
                        <button onClick={() => handleCaptioning(image)}>Captioning</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Captioning;
