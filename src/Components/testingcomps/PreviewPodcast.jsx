import React, { useState, useEffect } from 'react';
import {Grid} from '@mui/material'

function PreviewPodcast({ onPodcastClick }) {
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(''); // Track the selected genre option
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleShowSearchOptions = () => {
    setShowSearchOptions(!showSearchOptions);
  };

  const handleShowSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };


    const CardStyles = {
        cardImage: {
          width: "100%",
          borderRadius: "9px",
          marginBottom: "9px",
        },
    
        cardTitle: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "25px",
          color: "#2A445E",
        },
    
        cardSeason: {
          top: "6px",
          left: "6px",
          backgroundColor: "white",
          padding: "5px 7px",
          borderRadius: "2px",
          fontWeight: "bold",
          color: "#2A445E",
        },
    
        Paper: {
          width: "250px",
          height: "100%",
          fontsize: "12px",
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: "Black",
          padding: "15px",
        },
    
        CardButton: {
          color: "white",
          backgroundColor: "#841e62",
          border: "none",
          cursor: "pointer",
          padding: "10px",
          borderRadius: "9px",
          marginLeft: "25%",
          marginTop: "10px",
          paddingBottom: "10px",
        },
    
        descriptionButton: {
          color: "white",
          backgroundColor: "#841e62",
          border: "none",
          cursor: "pointer",
          padding: "10px",
          borderRadius: "9px",
          marginLeft: "25%",
        },
    
        CardUpdated: {
          color: "#2A445E",
        },
    
        cardDescription: {
          color: "#2A445E",
        },
      };
      
    const genreMap = {
        1: "Personal Growth",
        2: "True Crime and Investigative Journalism",
        3: "History",
        4: "Comedy",
        5: "Entertainment",
        6: "Business",
        7: "Fiction",
        8: "News",
        9: "Kids & Family"
    };

    useEffect(() => {
        // Fetch data from the API
        fetch('https://podcast-api.netlify.app/shows')
            .then((response) => response.json())
            .then((data) => {
                //console.log(data); // Check if you're receiving the expected data
                setPodcasts(data);
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, []);

    // Function to handle clicking on a podcast
    const handlePodcastClick = (podcastId, genre) => {
        console.log(`Clicked on podcast with ID: ${podcastId}`);
        // Add your logic here to handle the click event
        // For example, you can open a modal or navigate to a specific podcast page.
        onPodcastClick(podcastId, genre);
    };

      useEffect(() => {
        if (sortOption === 'A-Z') {
            setPodcasts([...podcasts.sort((a, b) => a.title.localeCompare(b.title))]);
        } else if (sortOption === 'Z-A') {
            setPodcasts([...podcasts.sort((a, b) => b.title.localeCompare(a.title))]);
        } else if (sortOption === 'Oldest') {
            setPodcasts([...podcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated))]);
        } else if (sortOption === 'Newest') {
            setPodcasts([...podcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated))]);
        }
    }, [sortOption, podcasts]);

    // Function to handle filtering based on the search query and genre when the search button is clicked
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '' || selectedGenre !== '') {
            const filteredPodcasts = podcasts.filter((podcast) => {
                const matchesSearchQuery = searchQuery.trim() === '' || podcast.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesGenre = selectedGenre === '' || (podcast.genres && podcast.genres.includes(parseInt(selectedGenre)));
                return matchesSearchQuery && matchesGenre;
            });
            setPodcasts(filteredPodcasts);
        }
    };

    if (loading) {
        return <div className='loadingState'>Loading...</div>;
    }

    return (

  

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
             
    

        <div className='Paper' style={CardStyles.Paper} >
           
       
  
  
  <form className='form'>
            
            <div>
                    <input
                        type="text"
                        className='form-search titleSearch'
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <select
                        className='form-search'
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        value={selectedGenre}
                    >
                        <option value="">All Genres</option>
                        {Object.entries(genreMap).map(([genreId, genreName]) => (
                            <option key={genreId} value={genreId}>{genreName}</option>
                        ))}
                    </select>
                </div>
 

 
              
                <button className='form-search' onClick={handleSearch}>Search</button>
                <div>
                    <select className='form-search' onChange={(e) => setSortOption(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="A-Z">A-Z</option>
                        <option value="Z-A">Z-A</option>
                        <option value="Oldest">Oldest</option>
                        <option value="Newest">Newest</option>
                    </select>
                </div>
            </form>

<div> <button onClick={() => removeFromFavorites(episode.id)}>
                Remove from Favorites
              </button>
    
              </div>
           


            {podcasts.map((podcast) => (
                <div key={podcast.id} className="podcastImage" onClick={() => onPodcastClick(podcast.id, podcast.genres)} >
                    <div className="imgDiv">
                        <img src={podcast.image} className="cardImage" style={CardStyles.cardImage} alt="podcastimage" />
                    </div>
                    <div >
                        <h4>{podcast.title}</h4>
                        <p>Season: {podcast.seasons}</p>
                        <p>
                            Genre: {podcast.genres && podcast.genres.length > 0
                                ? podcast.genres.map((genreId) => genreMap[genreId]).join(', ')
                                : 'N/A'}
                        </p>
                        <p>Updated: {new Date(podcast.updated).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                </div>
            ))}
        </div>
       
        </Grid>
    );
}

export default PreviewPodcast;