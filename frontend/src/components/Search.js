import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.module.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ stackOverflow: [], reddit: [] });
  const [email, setEmail] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('relevance');

  // Function to initialize Weglot
  useEffect(() => {
    if (window.Weglot) {
      window.Weglot.initialize({
        api_key: process.env.API_KEY, // Ensure this is your correct Weglot API key
      });
    }
  }, []);

  const handleSearch = async () => {
    setHasSearched(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/search?q=${query}`);
      console.log("Search API Response:", res.data);
      setResults(res.data || { stackOverflow: [], reddit: [] });

      // After setting results, trigger Weglot refresh
      if (window.Weglot && typeof window.Weglot.refresh === 'function') {
        window.Weglot.refresh();
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      alert('Failed to fetch search results. Please try again later.');
    }
  };

  const handleEmail = async () => {
    try {
      const limitedResults = {
        stackOverflow: results.stackOverflow.slice(0, 5),
        reddit: results.reddit.slice(0, 5),
      };

      await axios.post('http://localhost:5000/api/send-email', {
        email,
        results: limitedResults,
      });

      alert('Email sent successfully');
      setResults({ stackOverflow: [], reddit: [] });
      setEmail('');
      setHasSearched(false);
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.data : error.message);
      alert('Failed to send email. Please check your input and try again.');
    }
  };

  const filterResults = (results) => {
    if (filter === 'stackoverflow') {
      return results.stackOverflow;
    } else if (filter === 'reddit') {
      return results.reddit;
    }
    return [...results.stackOverflow, ...results.reddit];
  };

  const sortResults = (results) => {
    return results.sort((a, b) => {
      switch (sort) {
        case 'date':
          const dateA = a?.creation_date ?? a?.data?.created_utc ?? 0;
          const dateB = b?.creation_date ?? b?.data?.created_utc ?? 0;
          return dateB - dateA;
        case 'upvotes':
          const upvotesA = a?.score ?? a?.data?.ups ?? 0;
          const upvotesB = b?.score ?? b?.data?.ups ?? 0;
          return upvotesB - upvotesA;
        case 'comments':
          const commentsA = a?.answer_count ?? a?.data?.num_comments ?? 0;
          const commentsB = b?.answer_count ?? b?.data?.num_comments ?? 0;
          return commentsB - commentsA;
        case 'relevance':
        default:
          return 0;
      }
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredAndSortedResults = filterResults(results);
  const sortedResults = sortResults(filteredAndSortedResults);

  const stackOverflowResults = sortedResults.filter(result => result.question_id);
  const redditResults = sortedResults.filter(result => result.data && result.data.id);

  return (
    <div className="searchContainer">
      <h1>Search for Questions</h1>
      <input
        type="text"
        placeholder="Search for questions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="searchInput"
      />
      <button onClick={handleSearch} className="searchButton">Search</button>

      <div className="filterSortContainer">
        <div className="dropdown">
          <label>Filter by:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="dropdownSelect">
            <option value="all">All</option>
            <option value="stackoverflow">Stack Overflow</option>
            <option value="reddit">Reddit</option>
          </select>
        </div>
        <div className="dropdown">
          <label>Sort by:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="dropdownSelect">
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="upvotes">Upvotes</option>
            <option value="comments">Number of Comments</option>
          </select>
        </div>
      </div>

      {hasSearched && (sortedResults.length > 0) ? (
        <div>
          {stackOverflowResults.length > 0 && (
            <>
              <h2>Stack Overflow Results</h2>
              <ul className="resultsList">
                {stackOverflowResults.map(result => (
                  <li key={result.question_id} className="resultItem">
                    <a href={result.link} target="_blank" rel="noopener noreferrer">
                      <strong>{result.title}</strong>
                    </a>
                    <p>{`Asked by: ${result.owner.display_name}`}</p>
                    <p>{`Score: ${result.score || 0}`}</p>
                    <p>{`Comments: ${result.answer_count || 0}`}</p>
                    <p>{`Created on: ${formatDate(result.creation_date)}`}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {redditResults.length > 0 && (
            <>
              <h2>Reddit Results</h2>
              <ul className="resultsList">
                {redditResults.map(result => (
                  <li key={result.data.id} className="resultItem">
                    <a href={result.data.url} target="_blank" rel="noopener noreferrer">
                      <strong>{result.data.title}</strong>
                    </a>
                    <p>{`Subreddit: ${result.data.subreddit}`}</p>
                    <p>{`Upvotes: ${result.data.ups || 0}`}</p>
                    <p>{`Comments: ${result.data.num_comments || 0}`}</p>
                    <p>{`Created on: ${formatDate(result.data.created_utc)}`}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="emailContainer">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="emailInput"
            />
            <button onClick={handleEmail} className="emailButton">Send Email</button>
          </div>
        </div>
      ) : (
        hasSearched && <p>No results found.</p>
      )}
    </div>
  );
};

export default Search;
