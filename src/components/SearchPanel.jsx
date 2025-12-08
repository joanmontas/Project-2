import { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

import Button from './other/Button';
import './SearchPanel.css';

function SearchPanel({ isOpen, onClose, onUploadSelected }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBibs, setSelectedBibs] = useState([]);

    // Dummy data for now (later this will come from backend)
    const [allBibs, setAllBibs] = useState([]); // Store all user's bibliographies
    const [loading, setLoading] = useState(false);

    // Load bibliographies from Firestore when panel opens
    useEffect(() => {
        if (isOpen) {
            loadBibliographies();
        }
    }, [isOpen]);

    const loadBibliographies = async () => {
        const user = auth.currentUser;

        if (!user) {
            console.log(' No user logged in');
            return;
        }

        setLoading(true);

        try {
            console.log(' Loading bibliographies from Firestore...');

            const querySnapshot = await getDocs(
                collection(db, `users/${user.uid}/bibliographies`)
            );

            const bibs = [];
            querySnapshot.forEach((doc) => {
                bibs.push({
                    id: doc.id, // Use Firestore document ID
                    firestoreId: doc.id,
                    ...doc.data()
                });
            });

            setAllBibs(bibs);
            console.log(` Loaded ${bibs.length} bibliographies`);

        } catch (error) {
            console.error(' Error loading bibliographies:', error);
        } finally {
            setLoading(false);
        }
    };

    // Live search - runs whenever searchQuery changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim() === '') {
                setSearchResults([]);
                return;
            }

            const results = allBibs.filter(bib =>
                bib.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bib.author?.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setSearchResults(results);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, allBibs]); // Add allBibs to dependencies

    const handleCheckboxChange = (bibId) => {
        setSelectedBibs(prev => {
            if (prev.includes(bibId)) {
                return prev.filter(id => id !== bibId);
            } else {
                return [...prev, bibId];
            }
        });
    };

    const handleUpload = () => {
        const selected = searchResults.filter(bib => selectedBibs.includes(bib.id));

        console.log('=== SELECTED BIBTEX ENTRIES ===');
        console.log('Count:', selected.length);
        selected.forEach((bib, index) => {
            console.log(`\n[${index + 1}] ${bib.type.toUpperCase()}: ${bib.citationKey}`);
            console.log('Full data:', bib);
        });
        console.log('================================');

        onUploadSelected(selected);

        // Reset and close
        setSearchQuery('');
        setSearchResults([]);
        setSelectedBibs([]);
        onClose();
    };

    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Delay focus slightly to wait for animation
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`panel-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            {/* Slide-in Panel */}
            <div className={`search-panel ${isOpen ? 'open' : ''}`}>
                <div className="panel-header">
                    <h2>Search BibTeX</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="panel-content">
                    {/* Search Input - NO BUTTON */}
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="results-section">
                            <h3>Search Results ({searchResults.length})</h3>
                            <div className="results-list">
                                {searchResults.map(bib => (
                                    <div key={bib.id} className="result-item">
                                        <input
                                            type="checkbox"
                                            id={`bib-${bib.id}`}
                                            checked={selectedBibs.includes(bib.id)}
                                            onChange={() => handleCheckboxChange(bib.id)}
                                        />
                                        <label htmlFor={`bib-${bib.id}`} className="result-info">
                                            <div className="result-title">{bib.title}</div>
                                            <div className="result-meta">
                                                {bib.author} ({bib.year})
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No results message */}
                    {searchQuery && searchResults.length === 0 && (
                        <div className="no-results">
                            <p>No results found for "{searchQuery}"</p>
                        </div>
                    )}

                    {!searchQuery && !loading && (
                        <div className="empty-state">
                            <p>Start typing to search your BibTeX database...</p>
                            <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                                {allBibs.length} entries in your library
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="empty-state">
                            <p>Loading your bibliographies...</p>
                        </div>
                    )}

                    {/* Upload Button */}
                    {selectedBibs.length > 0 && (
                        <div className="upload-section">
                            <Button
                                text={`Upload (${selectedBibs.length} selected)`}
                                onClick={handleUpload}
                                type="primary"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default SearchPanel;