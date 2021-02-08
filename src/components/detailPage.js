import React from "react";
import { withRouter, Switch, Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Loader from "./loader";


const Container = styled.div`
  width: 800px;
  margin: auto;
`;
class DetailPage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  state = {
    detail: {},
    id: null,
    isRated: false,
    rate: 0,
    isLogging: false,
    ratedList: [],
    currentRate: 0,
    genres: [],
  };
  
  componentDidMount() {
    this.setState(
      {
        ...this.state,
        id: this.props.currentDetail,
        isLogging: this.props.isLogging,
        isRated:
          this.props.isLogging &&
          this.props.ratedList.some(
            (movie) => movie.id === this.props.currentDetail
          )
      },
      () => {
        this.setState({
          rate: this.state.isRated
            ? this.props.ratedList.find((movie) => movie.id === this.state.id)
                .rating
            : 0
        });
      }
    );

    fetch(
      `https://api.themoviedb.org/3/movie/${this.props.currentDetail}?api_key=31846cd2c427dd933fa6849953b3974d`
    )
      .then((resp) => resp.json())
      .then((resp) => {
        this.setState({ detail: resp });
      });
    const { match, location, history } = this.props;
    this.props.getAddress(this.props.location.pathname);
  }
  createRate() {
    const rateList = [...Array(10).keys()];
    return rateList;
  }

  render() {
    return (
      <Container>
        <div className="detail-page">
          <div className="rate-page">
            <div className="Poster">
              <img
                className="poster"
                src={`https://image.tmdb.org/t/p/w500/${this.state.detail.poster_path}`}
              />
            </div>
            {/* <div>{this.props.location.pathname}</div> */}
            <div className="detail">
              <h1>{this.state.detail.original_title}</h1>
              <h2>Release Date:</h2>
              <span>{this.state.detail.release_date}</span>
              <h2>Overview</h2>
              <p>{this.state.detail.overview}</p>
             {/* <h2>Genres</h2> */}
              {/* {this.state.genres.map((genre) => {
                return <div className="genre-item">genre.name</div>
              })} */}
              
              <h2> Average Rating</h2>
              <span>{this.state.detail.vote_average}</span>
              <h2
                
              >
                {" "}
                Your Rating!
              </h2>
              <div className="rate">
                <span>{this.state.isRated ? "Rated!" : "Not yet"}</span>
                <select
                  onChange={(e) => {
                    this.setState({ currentRate: e.target.value });
                  }}
                >
                  {[...Array(10).keys()].map((rate) => (
                    <option value={rate + 1}>{rate + 1}</option>
                  ))}
                </select>
                <span style={{ display: this.state.isLogging ? "" : "none" }}>
                  {this.props.ratedList.some(
                    (movie) => movie.id === this.state.id
                  )
                    ? `${this.state.rate}`
                    : ""}
                </span>
                {this.props.rateSuccess ? (
                  <Loader />
                ) : (
                  <button
                    onClick={(e) => {
                      if (this.state.isLogging) {
                        this.props.rate(
                          parseInt(this.state.currentRate),
                          this.state.id
                        );
                        this.setState({ isRated: true });
                        this.setState({ rate: this.state.currentRate });
                      } else {
                        alert("plz log in first");
                      }
                    }}
                  >
                    Rate!
                  </button>
                )}

                {/* <span style={{ display: this.props.rateSuccess ? "" : "none" }}>
                  {" "}
                  Rate Updated!
                </span> */}
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default withRouter(DetailPage);
