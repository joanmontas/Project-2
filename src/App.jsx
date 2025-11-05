import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInAnonymously,
  signInWithCustomToken
} from 'firebase/auth';
import {
  getFirestore,
  addDoc,
  collection,
  setLogLevel,
  onSnapshot
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB6OrvZS_9sXqaNc7CBCxWkKVEh1yjgtdw",
    authDomain: "project-2-1ffdc.firebaseapp.com",
    databaseURL: "https://project-2-1ffdc-default-rtdb.firebaseio.com",
    projectId: "project-2-1ffdc",
    storageBucket: "project-2-1ffdc.firebasestorage.app",
    messagingSenderId: "175352414713",
    appId: "1:175352414713:web:617157956ebfcdd7817d28",
    measurementId: "G-YXWTQFVQPX"
};

const appId = firebaseConfig.projectId;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setLogLevel('debug');


export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [articleTitle, setArticleTitle] = useState('');
  const [articleAuthors, setArticleAuthors] = useState('');

  const [articlesList, setArticlesList] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      setIsLoading(false);
    });

    const performInitialSignIn = async () => {
      setIsLoading(true);
      if (!auth.currentUser) {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            console.log("Signing in with custom token...");
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            console.log("Signing in anonymously...");
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Error during initial sign-in:", error);
          setUser(null);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    performInitialSignIn();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setArticlesList([]);
      return;
    }

    const userId = user.uid;

    const articlesCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'articles');
    const unsubscribeArticles = onSnapshot(articlesCollectionRef, (snapshot) => {
      const articlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArticlesList(articlesData);
    }, (error) => {
      console.error("Error fetching articles:", error);
    });

    return () => {
      unsubscribeArticles();
    };

  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!user || !articleTitle.trim() || !articleAuthors.trim()) {
      console.error("Not logged in or title/authors are empty!");
      return;
    }
    const userId = user.uid;

    const authorsArray = articleAuthors
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    try {
      const collectionRef = collection(db, 'artifacts', appId, 'users', userId, 'articles');
      await addDoc(collectionRef, {
        title: articleTitle,
        authors: authorsArray,
        createdAt: new Date()
      });
      console.log("Article saved!");
      setArticleTitle('');
      setArticleAuthors('');
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };


  return (
    <>
      <div style={{ padding: '20px', maxWidth: '500px', margin: '40px auto', border: '1px solid #eee', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
        <h1>
          My Firebase React App
        </h1>

        {isLoading && (
          <div>
            <p>Loading...</p>
          </div>
        )}

        {!isLoading && (
          <div id="app-content">
            <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h2>Authentication</h2>
              
              <p>
                {user 
                  ? `Logged in as: ${user.displayName || user.email || (user.isAnonymous ? 'Anonymous User' : 'User')}`
                  : "You are logged out."
                }
              </p>
              
              {user && (
                <p style={{ fontSize: '12px', wordBreak: 'break-all', color: '#555' }}>
                  Your User ID: {user.uid}
                </p>
              )}

              <div>
                {!user || user.isAnonymous ? (
                  <button 
                    onClick={handleLogin}
                    style={{ padding: '8px 12px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Login with Google
                  </button>
                ) : (
                  <button 
                    onClick={handleLogout}
                    style={{ padding: '8px 12px', background: '#db4437', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>

            {user && (
              <div id="user-data-section">

                <div style={{ padding: '15px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <h2>Add New Article</h2>
                  
                  <form onSubmit={handleAddArticle} style={{ marginBottom: '15px' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label htmlFor="articleTitle" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Article Title:
                      </label>
                      <input
                        id="articleTitle"
                        type="text"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="Enter article title"
                        style={{ width: 'calc(100% - 24px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="articleAuthors" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Authors:
                      </label>
                      <input
                        id="articleAuthors"
                        type="text"
                        value={articleAuthors}
                        onChange={(e) => setArticleAuthors(e.target.value)}
                        placeholder="e.g. John Doe, Jane Smith"
                        style={{ width: 'calc(100% - 24px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    </div>

                    <button type="submit" style={{ marginTop: '15px', padding: '10px 15px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Add Article
                    </button>
                  </form>
                </div>

                <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
                  
                  <div>
                    <h3>My Articles</h3>
                    {articlesList.length === 0 ? (
                      <p>No articles added yet.</p>
                    ) : (
                      <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        {articlesList.map(article => (
                          <li key={article.id} style={{ marginBottom: '10px' }}>
                            <strong>{article.title}</strong>
                            <br />
                            <span style={{ fontSize: '0.9em', color: '#555' }}>
                              Authors: {article.authors.join(', ')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                </div>
                
              </div>
            )}

          </div>
        )}

      </div>
    </>
  );
}