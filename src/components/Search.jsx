import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {app, auth, db} from '../firebase';
import {
    addDoc,
    collection,
    collectionGroup,
    onSnapshot,
    query,
    getDocs,
    where
} from 'firebase/firestore';
import Button from './other/Button';
import Navbar from './Navbar';
import './Search.css'

const appID = "project-2-1ffdc";



function Search() {
    const [isLoading, setIsLoading] = useState(true);
    const [articleTitle, setArticleTitle] = useState('');
    const [articleAuthors, setArticleAuthors] = useState('');
    const [articlesList, setArticlesList] = useState([]);

    const showID = () => {
        console.log(auth.currentUser.uid);
        console.log(app, auth.config);
        return;
    };



    useEffect(() => {
        if (!auth.currentUser) {
        setArticlesList([]);
        return;
        }
        const userId = auth.currentUser.uid;

        const articlesCollectionRef = collection(db, 'artifacts', appID, 'users', userId, 'articles');
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
    }, [auth.currentUser]);



    const handleAddArticle = async (e) => {
        e.preventDefault();
        if (!auth.currentUser.uid || !articleTitle.trim() || !articleAuthors.trim()) {
        console.error("Not logged in or title/authors are empty!");
        return;
        }
        const userID = auth.currentUser.uid;
        //const appID = app.projectId;


        const authorsArray = articleAuthors
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);

        try {
        const collectionRef = collection(db, 'artifacts', appID, 'users', userID, 'articles');
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

    const handleFindArticle = async (e) => {
        e.preventDefault();
        const userID = auth.currentUser.uid;
        const appID = app.options.appId;

        const searchCol = collectionGroup(db, 'articles');
        const searchDocs = await getDocs(searchCol);
        searchDocs.forEach(doc => {
          console.log("found doc");
          console.log(doc.data());
        })
        // const q = query(searchCol);

        // const querySnapshot = await getDocs(collection(db, 'artifacts'));
        // // searchResult = querySnapshot;
        // console.log("find article", db, appID, userID);
        // console.log(querySnapshot.size);
        // console.log(querySnapshot);
        
            
        // querySnapshot.forEach((doc) => {
        //     console.log(doc.id, " => ", doc.data());
        // });



    /// query on article title

    // print below search box
    };

    return(
    <>
    <Navbar isLoggedIn={true} />
        <Button
        text={'Show login ID'}
        onClick={showID}
        type="primary"
        />

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

                  <form onSubmit={handleFindArticle}>
                    <input type="text" />
                    <button>
                      Search for books.
                    </button>



                  </form>

                  {/* {searchResult.length === 0 ? (
                      <p>No search added yet.</p>
                    ) : (
                      <ul>
                        {searchResult.map(article => (
                          <li key={article.id} style={{ marginBottom: '10px' }}>
                            <span >
                              Authors: {article}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )} */}


    </>
    );

}

export default Search;
