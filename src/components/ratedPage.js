import React from "react";
import { Link, withRouter } from "react-router-dom";
const RatedPage = (props) => {
  
  const ratedListCard = props.ratedList.map((movie) => {
    return {title: movie.original_title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      id: movie.id,
      rating: movie.rating}
  })
  

  return !props.isLogging ? (
    <h1> Plz log in first</h1>
  ) : (
    <div className="container">
      {ratedListCard.map((movie) => {
        return (
          <div key={movie.id} className="movie-card">
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              // src="https://image.tmdb.org/t/p/w500//8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg"
              alt=" "
            />
            <Link to={`/movie/${movie.id}`}>
              <div
                className="movie-title"
                onClick={(e) => props.clickTitle(movie.id)}
              >
                {movie.title}
              </div>
            </Link>

            <div className="movie-rate">
              <div className="rate">
                <span style={{ color: "#F9F504" }}>&#9733;</span>
                <span>
                  {`${
                    movie.rating
                  } / `}
                </span>
                <span>{movie.vote_average}</span>
              </div>
              <div
                className={
                  props.likedList.some(
                    (likedMovie) => likedMovie.id === movie.id
                  ) && props.isLogging
                    ? "like-icon-liked"
                    : "like-icon"
                }
                onClick={(e) => props.clickLike(movie.id)}
              >
                &hearts;
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default withRouter(RatedPage);
