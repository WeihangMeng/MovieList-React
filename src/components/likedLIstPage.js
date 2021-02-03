import React from "react";
import { Link, withRouter } from "react-router-dom";
import CardContainer from "./container";
const LikedListPage = (props) => {
  const likedListCard = props.movieCard.filter((movie) => {
    if (props.likedList.some((id) => id === movie.id)) {
      return movie;
    }
  });
  return !props.isLogging ? (
    <h1> Plz log in first</h1>
  ) : (
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
