import React from "react";
import {useEffect, useState} from "react";
import { Link, withRouter } from "react-router-dom";
import CardContainer from "./container";
const LikedListPage = (props) => {
  
  
  const likedListCard = props.likedList.map((movie) => {
      return {title: movie.original_title,
                  poster: movie.poster_path,
                  rate: movie.vote_average,
                  id: movie.id}
    });
 
  return !props.isLogging ? (
    <h1> Plz log in first</h1>
  ) : (
    // <div>this is liked page</div>
    <CardContainer
      isLogging={props.isLogging}
      movieCard={likedListCard}
      likedList={likedListCard}
      clickTitle={props.clickTitle}
      clickLike={props.clickLike}
      pageDisplay={props.pageDisplay}
    />
  );
};

export default withRouter(LikedListPage);
