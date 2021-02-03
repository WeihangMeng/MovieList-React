import React from "react";
import { withRouter, Switch, Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import Loader from "./loader";

// adult: false
// backdrop_path: "/lOSdUkGQmbAl5JQ3QoHqBZUbZhC.jpg"
// belongs_to_collection: null
// budget: 0
// genres: Array(3)
// homepage: "https://www.netflix.com/title/81074110"
// id: 775996
// imdb_id: "tt10451914"
// original_language: "en"
// original_title: "Outside the Wire"
// overview: "In the near future, a drone pilot is sent into a deadly militarized zone and must work with an android officer to locate a doomsday device."
// popularity: 3519.784
// poster_path: "/e6SK2CAbO3ENy52UTzP3lv32peC.jpg"
// production_companies: Array(4)
// production_countries: Array(1)
// release_date: "2021-01-15"
// revenue: 0
// runtime: 114
// spoken_languages: Array(1)
// status: "Released"
// tagline: "Defiant by design."
// title: "Outside the Wire"
// video: false
// vote_average: 6.5
// vote_count: 474
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
    currentRate: 0
  };
  // componentDidUpdate(prev) {
  //   if (prev.ratedList !== this.state.ratedList) {
  //     this.setState({ rateUpdate: true });
  //   }
  // }
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
                .rate
            : 0
        });
      }
    );

    fetch(
      // `https://api.themoviedb.org/3/movie/560144?api_key=31846cd2c427dd933fa6849953b3974d`
      `https://api.themoviedb.org/3/movie/${this.props.currentDetail}?api_key=31846cd2c427dd933fa6849953b3974d`
    )
      .then((resp) => resp.json())
      .then((resp) => {
        this.setState({ detail: resp }, () => {
          console.log(this.state.detail);
          console.log(this.state.id);
        });
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
            {/* <div
              className="rate-success"
              style={{ display: this.props.rateSuccess ? "" : "none" }}
            >
              <div className="rate-container">
                <span>Rate Success!</span>
              </div> */}{" "}
            */}
            {/* </div> */}
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
              <h2
                onClick={(e) => {
                  console.log(this.state.detail.genres);
                }}
              >
                Genres
              </h2>
              {/* {this.state.detail.genres} */}
              <h2> Average Rating</h2>
              <span>{this.state.detail.vote_average}</span>
              <h2
                onClick={(e) => {
                  console.log("app", this.props.isLogging);
                  console.log("local", this.state.isLogging);
                }}
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
