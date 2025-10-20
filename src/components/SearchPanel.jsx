import { useState, useEffect, useRef } from 'react';
import Button from './other/Button';
import './SearchPanel.css';

function SearchPanel({ isOpen, onClose, onUploadSelected }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBibs, setSelectedBibs] = useState([]);

    // Dummy data for now (later this will come from backend)
    const dummyBibs = [
        { id: 1, title: 'Introduction to Machine Learning', author: 'John Doe', year: 2020 },
        { id: 2, title: 'Deep Learning Fundamentals', author: 'Jane Smith', year: 2021 },
        { id: 3, title: 'Neural Networks and AI', author: 'Mike Johnson', year: 2019 },
        { id: 4, title: 'Data Science Basics', author: 'Sarah Williams', year: 2022 },
        { id: 5, title: 'Machine Learning Algorithms', author: 'David Brown', year: 2023 },
        { id: 6, title: 'Artificial Intelligence Ethics', author: 'Emily Davis', year: 2021 },
    ];

    // Live search - runs whenever searchQuery changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim() === '') {
                setSearchResults([]);
                return;
            }

            const results = dummyBibs.filter(bib =>
                bib.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bib.author.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setSearchResults(results);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

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
        console.log('Uploading selected bibs:', selected);
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

                    {/* Empty state - show when no search query */}
                    {!searchQuery && (
                        <div className="empty-state">
                            <p>Start typing to search your BibTeX database...</p>
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