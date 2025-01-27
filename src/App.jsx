import { useState, useEffect } from "react"
import Search from "./components/Search"
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchValue, getTrendingMovies } from "./appwrite";


const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  }
}

const App = () => {

  const [searchValue, setSearchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchValue, setdebouncedSearchValue] = useState(searchValue, 500);
  
  //Dbouncer to wait for 500ms before making a request (to avoid making too many requests)
  useDebounce(() => { setdebouncedSearchValue(searchValue) }, 500, [searchValue]);


  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

   try {
    const endpoint = query 
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
    const response = await fetch(endpoint, API_OPTIONS);
    if(!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data = await response.json();
    if(data.results === false) {
      setErrorMessage(data.Error || 'No movies found');
      setMovieList([]);
      return
    }
   
    setMovieList(data.results || []);

    // updateSearchValue(data.results || []);
    if(query && data.results.length > 0) {
      await updateSearchValue(query, data.results[0]);}
    
   } catch (error) {
      console.error('Error fetching movies: ', error);
      setErrorMessage('Error fetching movies. Please try again later.');
   } finally {
     setIsLoading(false);
   }
    
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
      
    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  }



  useEffect(() => {fetchMovies(debouncedSearchValue);}, [debouncedSearchValue])
  useEffect(() => {loadTrendingMovies()}, [])

  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="hero-img.png" alt="" />
          <h1>Find <span className="text-gradient">Movies</span> You will Enjoy without the Hassle</h1>
          <Search searchValue={searchValue} setSearchValue={setSearchValue} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
export default App