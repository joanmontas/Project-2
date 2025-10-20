import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './other/Button';
import SearchPanel from './SearchPanel';
import Navbar from './Navbar';

import './Home.css';

function Home() {
  const [selectedFormat, setSelectedFormat] = useState('MLA');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedBibs, setSelectedBibs] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  const formats = ['MLA', 'APA', 'Chicago', 'Harvard', 'Vancouver'];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      setUploadedFile(file);
      console.log('File uploaded:', file.name);
    } else {
      alert('Please upload a .txt file');
    }
  };

  const handleSearchBib = () => {
    setIsPanelOpen(true);
  };

  const handleUploadSelected = (bibs) => {
    setSelectedBibs(prev => {
      // Filter out duplicates by id
      const newBibs = bibs.filter(bib =>
        !prev.some(existingBib => existingBib.id === bib.id)
      );
      return [...prev, ...newBibs];
    });
    console.log('Selected bibs from search:', bibs);
  };

  const handleGenerateHTML = () => {
    if (!uploadedFile && selectedBibs.length === 0) {
      alert('Please upload a BibTeX file or select from database');
      return;
    }
    console.log('Generating HTML with format:', selectedFormat);
    console.log('Using:', uploadedFile ? 'Uploaded file' : 'Selected bibs', selectedBibs);
    navigate('/preview');
    // Backend integration will go here later
  };

  const handleDeleteBib = (bibId) => {
    setSelectedBibs(prev => prev.filter(bib => bib.id !== bibId));
  };

  return (
    <>
      <Navbar isLoggedIn={true} />

      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">BibTeX to HTML Converter</h1>
          <p className="home-subtitle">Convert your bibliography to beautifully formatted HTML</p>

          <div className="home-card">
            {/* Upload and Search Buttons */}
            <div className="action-buttons">
              <label htmlFor="file-upload" className="upload-btn">
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.bib"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                Upload BibTeX
              </label>

              <Button
                text="Search BibTeX"
                onClick={handleSearchBib}
                type="secondary"
              />
            </div>

            {/* Show uploaded file name */}
            {uploadedFile && (
              <div className="file-info">
                <p>✓ File uploaded: <strong>{uploadedFile.name}</strong></p>
              </div>
            )}

            {/* Show selected bibs from search */}
            {selectedBibs.length > 0 && (
              <div className="file-info">
                <p>✓ Selected from database: <strong>{selectedBibs.length} item(s)</strong></p>
                <div className="selected-bibs-list">
                  {selectedBibs.map(bib => (
                    <div key={bib.id} className="selected-bib-item">
                      <span>{bib.title}</span>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteBib(bib.id)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Format Dropdown */}
            <div className="format-section">
              <label htmlFor="format-select">Citation Format</label>
              <select
                id="format-select"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="format-dropdown"
              >
                {formats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <div className="generate-section">
              <Button
                text="Generate HTML"
                onClick={handleGenerateHTML}
                type="primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Panel */}
      <SearchPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onUploadSelected={handleUploadSelected}
      />
    </>
  );
}

export default Home;