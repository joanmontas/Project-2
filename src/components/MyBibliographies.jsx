import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from './Navbar';
import './MyBibliographies.css';

function MyBibliographies() {
  const [bibliographies, setBibliographies] = useState([]);
  const [filteredBibs, setFilteredBibs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bibliographies on mount
  useEffect(() => {
    loadBibliographies();
  }, []);

  // Filter bibliographies when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBibs(bibliographies);
    } else {
      const filtered = bibliographies.filter(bib =>
        bib.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bib.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bib.year?.toString().includes(searchQuery)
      );
      setFilteredBibs(filtered);
    }
  }, [searchQuery, bibliographies]);

  const loadBibliographies = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      console.log('⚠️ No user logged in');
      return;
    }

    setLoading(true);

    try {
      console.log('📚 Loading bibliographies...');
      
      const querySnapshot = await getDocs(
        collection(db, `users/${user.uid}/bibliographies`)
      );

      const bibs = [];
      querySnapshot.forEach((doc) => {
        bibs.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setBibliographies(bibs);
      setFilteredBibs(bibs);
      console.log(`✅ Loaded ${bibs.length} bibliographies`);

    } catch (error) {
      console.error('❌ Error loading bibliographies:', error);
      alert('Failed to load bibliographies');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (bibId) => {
    setSelectedIds(prev => {
      if (prev.includes(bibId)) {
        return prev.filter(id => id !== bibId);
      } else {
        return [...prev, bibId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredBibs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBibs.map(bib => bib.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Please select bibliographies to delete');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} bibliograph${selectedIds.length > 1 ? 'ies' : 'y'}?`
    );

    if (!confirmDelete) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      console.log('🗑️ Deleting selected bibliographies...');

      for (const bibId of selectedIds) {
        await deleteDoc(doc(db, `users/${user.uid}/bibliographies`, bibId));
        console.log(`✅ Deleted: ${bibId}`);
      }

      alert(`Successfully deleted ${selectedIds.length} bibliograph${selectedIds.length > 1 ? 'ies' : 'y'}`);
      
      setSelectedIds([]);
      loadBibliographies(); // Reload the list

    } catch (error) {
      console.error('❌ Error deleting bibliographies:', error);
      alert('Failed to delete bibliographies');
    }
  };

  const handleDeleteSingle = async (bibId, bibTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${bibTitle}"?`
    );

    if (!confirmDelete) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      console.log('🗑️ Deleting bibliography...');

      await deleteDoc(doc(db, `users/${user.uid}/bibliographies`, bibId));
      
      console.log(`✅ Deleted: ${bibTitle}`);
      alert('Bibliography deleted successfully');
      
      loadBibliographies(); // Reload the list

    } catch (error) {
      console.error('❌ Error deleting bibliography:', error);
      alert('Failed to delete bibliography');
    }
  };

  return (
    <>
      <Navbar isLoggedIn={auth.currentUser === null} />
      
      <div className="my-bib-container">
        <div className="my-bib-content">
          <h1>My Bibliographies</h1>

          {/* Search/Filter Box */}
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by title, author, or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Action Buttons */}
          <div className="action-bar">
            <button onClick={handleSelectAll} className="select-all-btn">
              {selectedIds.length === filteredBibs.length && filteredBibs.length > 0
                ? 'Deselect All'
                : 'Select All'}
            </button>
            <button 
              onClick={handleDeleteSelected} 
              className="delete-selected-btn"
              disabled={selectedIds.length === 0}
            >
              Delete Selected ({selectedIds.length})
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <p>Loading your bibliographies...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && bibliographies.length === 0 && (
            <div className="empty-state">
              <p>No bibliographies yet.</p>
              <p>Upload a .bib file from the Home page to get started!</p>
            </div>
          )}

          {/* No Results */}
          {!loading && bibliographies.length > 0 && filteredBibs.length === 0 && (
            <div className="no-results">
              <p>No bibliographies match "{searchQuery}"</p>
            </div>
          )}

          {/* Bibliography List */}
          {!loading && filteredBibs.length > 0 && (
            <div className="bib-list">
              <p className="bib-count">
                Showing {filteredBibs.length} of {bibliographies.length} bibliograph{bibliographies.length > 1 ? 'ies' : 'y'}
              </p>

              {filteredBibs.map((bib) => (
                <div key={bib.id} className="bib-item">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(bib.id)}
                    onChange={() => handleCheckboxChange(bib.id)}
                    className="bib-checkbox"
                  />
                  
                  <div className="bib-info">
                    <h3>{bib.title || 'Untitled'}</h3>
                    <p className="bib-meta">
                      <span className="bib-author">{bib.author || 'Unknown Author'}</span>
                      {' • '}
                      <span className="bib-year">{bib.year || 'N/A'}</span>
                      {' • '}
                      <span className="bib-type">{bib.type || 'misc'}</span>
                    </p>
                  </div>

                  <button
                    className="delete-single-btn"
                    onClick={() => handleDeleteSingle(bib.id, bib.title)}
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyBibliographies;