import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chapter.css';

const ChapitreAdd = () => {
  const [formData, setFormData] = useState({
    NameChapter: '',
    Course: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:400/Cours');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('Course', formData.Course);
    form.append('NameChapter', formData.NameChapter);
    form.append('FileUpload', file);

    try {
      const response = await axios.post('http://127.0.0.1:1000/chapitre', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSubmitMessage(response.data.message);
    } catch (error) {
      setSubmitMessage('Error adding chapter.');
      console.error('Error:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      NameChapter: '',
      Course: '',
    });
    setSubmitMessage('');
    setFile(null);
  };

  return (
    <div className="container">
      <h4>Chapters Details</h4>
      <hr />
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <table>
          <tbody>
            <tr>
              <td className="form-group">
                <label htmlFor="Course">Select Course</label>
                <select name="Course" value={formData.Course} onChange={handleChange} required>
                  <option value="">Select Course</option>
                  {courses && courses.map(course => (
                    <option key={course._id} value={course._id}>{course.Name}</option>
                  ))}
                </select>
              </td>
            </tr>
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

export default ChapitreAdd;
