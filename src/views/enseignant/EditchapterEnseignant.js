import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './chapter.css';

const ChapterEdit = () => {
    const [formData, setFormData] = useState({
        NameChapter: '',
        File: null,
    });
    const [submitMessage, setSubmitMessage] = useState('');
    const [file, setFile] = useState(null);
    const { id } = useParams(); // Récupérer l'ID du chapitre depuis les paramètres d'URL

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.NameChapter || !file) {
            setSubmitMessage('Please provide both chapter name and file.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('NameChapter', formData.NameChapter);

        try {
            await axios.put('http://localhost:5000/chapitre/${id}', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSubmitMessage('File uploaded successfully!');
        } catch (error) {
            setSubmitMessage('Error uploading file: ' + error.message);
        }
    };

    const handleReset = () => {
        setFormData({
            NameChapter: '',
            File: null,
        });
        setSubmitMessage('');
        setFile(null);
    };
    useEffect(() => {
        // Charger les informations du chapitre correspondant à partir de l'API en utilisant l'ID récupéré
        const fetchChapterData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/chapitre/${id}');
                const chapterData = response.data;
                setFormData({
                    NameChapter: chapterData.NameChapter,
                    // Autres champs de formulaire...
                });
            } catch (error) {
                console.error('Error fetching chapter data:', error);
            }
        };

        fetchChapterData();
    }, [id]);
    return (
        <div className="container">
            <h4>Chapter Edit</h4>
            <hr />
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <table>
                    <tbody>
                        <tr>
                            <td className="form-group">
                                <label htmlFor="NameChapter">Name Chapter</label>
                                <input type="text" id="NameChapter" name="NameChapter" value={formData.NameChapter} onChange={handleChange} required />
                            </td>
                        </tr>
                        <tr>
                            <td className="form-group">
                                <label htmlFor="FileUpload">Upload File (PDF/Word)</label>
                                <input type="file" onChange={handleFileChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="button-group">
                    <button type="submit">Submit ✔️</button>
                    <button type="reset">Cancel ❌</button>
                </div>
                {submitMessage && <p>{submitMessage}</p>}
            </form>
        </div>
    );
};

export default ChapterEdit;