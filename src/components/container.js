import React from "react";
// import AcUnit from "@material-ui/icons";
import { Link, Switch, Route } from "react-router-dom";

const cardContainer = (props) => {
  return (
    <div className="cardContainer">
      <div className="page" style={{ display: `${props.pageDisplay}` }}>
        <button onClick={(e) => props.prevPage(props.page)}>prev</button>
        <span>{props.page} / 50</span>
        <button onClick={(e) => props.nextPage(props.page)}>next</button>
      </div>
      <div className="container">
        {props.movieCard.map((movie) => {
          return (
            <div key={movie.id} className="movie-card">
              <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w500/${movie.poster}`}
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

                  <span>{movie.rate}</span>
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
    </div>
  );
};
export default cardContainer;
