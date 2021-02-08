import React, { useState } from "react";
import { Link, Switch, Route } from "react-router-dom";

const Header = (props) => {
  return (
    <div className="header">
      <div className="title">
        <div className="pannel">
          <img
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
            width="100"
          />
          <Link to="/">
            <button
              className="button"
              id="allMovie"
              onClick={(e) => props.cataSelect("all")}
            >
              ALL Movie
            </button>
          </Link>
          <Link to="/liked">
            <button
              className="button"
              id="likeList"
              onClick={(e) => props.cataSelect("liked")}
            >
              Liked List
            </button>
          </Link>
          <Link to="/rated">
            <button
              className="button"
              id="rated"
              onClick={(e) => props.cataSelect("rated")}
            >
              Rated List
            </button>
          </Link>
        </div>

        <div className="log-in-dir">
          <div className="log-in-button">
            <Link to="/log-in-page">
              <div onClick={(e) => props.loadLogIn()}>
                <span>{props.logIn ? props.userName : "plz log in"}</span>
              </div>
            </Link>
            <Link to="/logout">
              <button
                onClick={(e) => props.logOut()}
                style={{ display: `${props.logOutDisplay}` }}
                // style={{display: ""}}
              >
                log out
              </button>
            </Link>
          </div>
          
        </div>
      </div>

      <div className="filter" style={{ display: `${props.filterDisplay}` }}>
        <select
          className="filter-select"
          onChange={(e) => props.filterSelect(e.target.value)}
        >
          <option value="popular">Popular</option>
          <option value="now_playing">Now Playing</option>
          <option value="top_rated">Top Rated</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>
    </div>
  );
};
export default Header;
