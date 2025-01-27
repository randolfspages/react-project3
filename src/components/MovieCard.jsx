

const MovieCard = ({movie:{title, release_date, poster_path, vote_average, original_language}}) => {
  return (
    <div className="movie-card">
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} alt={title} />
        <div className="mt-4">
            <h3>{title}</h3>
            <div className="content">
                <div className="rating">
                    <img src="star.svg" alt="Star Icon" />
                    <p>{vote_average ? vote_average.toFixed(1) : 'n/a'}</p>
                </div>
                <span className="text-[10px]">►</span>
                <p className="lang">{original_language}</p>
                <span className="text-[10px]">►</span>
                <p className="year">{release_date ? release_date.split('-')[0] : 'n/a'}</p>
            </div>
        </div>
    </div>
  )
}

export default MovieCard