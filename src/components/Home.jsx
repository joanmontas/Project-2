import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './other/Button';
import SearchPanel from './SearchPanel';
import Navbar from './Navbar';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Home.css';
import * as bibtexParse from '@orcid/bibtex-parse-js';

function Home() {
  const [selectedFormat, setSelectedFormat] = useState('MLA');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedBibs, setSelectedBibs] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  const formats = ['MLA', 'APA', 'Chicago', 'Harvard', 'Vancouver'];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check file extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.bib') && !fileName.endsWith('.txt')) {
      alert('Please upload a .bib or .txt file');
      return;
    }

    // Get current user
    const user = auth.currentUser;
    if (!user) {
      alert('Please login to upload bibliographies');
      return;
    }

    try {
      console.log('📖 Reading file:', file.name);

      // Read file content
      const fileContent = await file.text();
      console.log('File content length:', fileContent.length);

      // Parse BibTeX
      // Parse BibTeX
      // Parse BibTeX
      const parsedEntries = bibtexParse.toJSON(fileContent);

      if (parsedEntries.length === 0) {
        alert('No BibTeX entries found in file');
        return;
      }

      // Save each entry to Firestore
      console.log('Saving to Firestore...');
      const savedBibs = [];

      for (const entry of parsedEntries) {
        const bibData = {
          type: entry.entryType || null,
          citationKey: entry.citationKey || null,
          author: entry.entryTags?.AUTHOR || entry.entryTags?.author || null,
          title: entry.entryTags?.TITLE || entry.entryTags?.title || null,
          year: parseInt(entry.entryTags?.YEAR || entry.entryTags?.year) || null,
          journal: entry.entryTags?.JOURNAL || entry.entryTags?.journal || null,
          publisher: entry.entryTags?.PUBLISHER || entry.entryTags?.publisher || null,
          booktitle: entry.entryTags?.BOOKTITLE || entry.entryTags?.booktitle || null,
          volume: entry.entryTags?.VOLUME || entry.entryTags?.volume || null,
          pages: entry.entryTags?.PAGES || entry.entryTags?.pages || null,
          address: entry.entryTags?.ADDRESS || entry.entryTags?.address || null,
          createdAt: serverTimestamp()
        };

        if (!bibData.type || !bibData.author || !bibData.title) {
          console.log(`⚠️ Skipping entry (missing required fields):`, entry.citationKey || 'unknown');
          continue; // Skip this entry
        }


        // Save to Firestore
        const docRef = await addDoc(
          collection(db, `users/${user.uid}/bibliographies`),
          bibData
        );

        console.log(`✅ Saved: ${bibData.title}`);

        // Add to local state
        savedBibs.push({
          id: Date.now() + Math.random(), // Temporary local ID
          firestoreId: docRef.id,
          ...bibData
        });
      }

      // Update state
      setSelectedBibs(prev => [...prev, ...savedBibs]);
      setUploadedFile(file);

      alert(`Successfully uploaded ${savedBibs.length} bibliographies!`);
      console.log(`✅ Upload complete: ${savedBibs.length} entries saved`);

    } catch (error) {
      console.error('❌ Upload error:', error);
      alert('Failed to parse or upload file. Please check the file format.');
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

    console.log('=== GENERATING HTML ===');
    console.log('Format:', selectedFormat);
    console.log('Selected bibs:', selectedBibs);
    console.log('=======================');

    // Navigate to preview page with data
    navigate('/preview', {
      state: {
        bibs: selectedBibs,
        format: selectedFormat
      }
    });
  };

  const handleDeleteBib = (bibId) => {
    setSelectedBibs(prev => prev.filter(bib => bib.id !== bibId));
  };

  return (
    <>
      <Navbar isLoggedIn={auth.currentUser === null} />

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