import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Home.css';
import { assets } from '../../assets/assets';

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const history = useHistory();
  const [showGreeting, setShowGreeting] = useState(false);
  const [name, setName] = useState('');
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('title'); // Default sort by title
  const [sortOrder, setSortOrder] = useState('asc'); // Default ascending order

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories/published', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setStories(result);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();

    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setName(storedName);
    }

    const greetingShown = localStorage.getItem('greetingShown');
    if (!greetingShown) {
      setShowGreeting(true);
      localStorage.setItem('greetingShown', 'true');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('greetingShown');
    setIsLoggedIn(false);
  };

  const handleProfileClick = () => {
    history.push('/profile');
  };

  const handleWritingClick = () => {
    history.push('/writing');
  };

  const handleStoryClick = (storyId) => {
    history.push(`/stories/${storyId}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortCriteriaChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const sortStories = (stories, criteria, order) => {
    return stories.sort((a, b) => {
      let valueA, valueB;
      if (criteria === 'title') {
        valueA = stripHtml(a.topicName || '').toLowerCase();
        valueB = stripHtml(b.topicName || '').toLowerCase();
      } else if (criteria === 'createdAt') {
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
      }

      if (order === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  };

  const filteredStories = stories.filter((story) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      story.topicName.toLowerCase().includes(lowerQuery) ||
      story.category.toLowerCase().includes(lowerQuery) ||
      (story.userId?.name && story.userId.name.toLowerCase().includes(lowerQuery))
    );
  });

  const sortedStories = sortStories(filteredStories, sortCriteria, sortOrder);

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="home-container">
      <div className="top-right">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <div className="top-left">
        <div className="profile-picture-container">
          <img
            src={assets.defaultpfp}
            alt="Profile"
            className="profile-picture"
            onClick={handleProfileClick}
          />
          {showGreeting && <h5>Hello, {name ? name : 'User'}!</h5>}
        </div>
      </div>
      <div className="welcome-section">
        <h1>Welcome to SOYO</h1>
        <p>Story Of Your Own</p>
        <div className="button-container">
          <button className="btn" onClick={handleWritingClick}>Start Writing</button>
          <input
            type="text"
            placeholder="Search stories..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="sorting-container">
          <select value={sortCriteria} onChange={handleSortCriteriaChange}>
            <option value="title">Sort by Title</option>
            <option value="createdAt">Sort by Time Created</option>
          </select>
          <select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div className="story-cards-container">
        {sortedStories.length === 0 ? (
          <p></p>
        ) : (
          sortedStories.map((story) => (
            <div
              key={story._id}
              className="story-card"
              onClick={() => handleStoryClick(story._id)}
            >
              <div
                className="story-card-header"
                dangerouslySetInnerHTML={{ __html: story.topicName || 'No title available' }}
              />
              <p>Author: {story.userId?.name || 'Unknown'}</p>
              <div
                className="story-description"
                dangerouslySetInnerHTML={{ __html: story.description || 'No description available' }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
