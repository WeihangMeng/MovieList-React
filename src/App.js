import "./styles.css";
import React from "react";
import Header from "./components/header";
import styled from "styled-components";
import CardContainer from "./components/container";
import { Redirect, BrowserRouter, Route, Link, Switch } from "react-router-dom";
import LikedListPage from "./components/likedListPage";
import Loader from "./components/loader";
import RatedPage from "./components/ratedPage";
import LogInPage from "./components/logInPage";
import DetailPage from "./components/detailPage";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Container = styled.div`
  width: 400px;
  margin: auto;
`;
const baseUrl = "https://api.themoviedb.org/3/movie/";
const apiKey = "?api_key=31846cd2c427dd933fa6849953b3974d&page=1";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //list
      movieList: [],
      likedListCard: [],
      movieCard: [],
      likedList: [],
      ratedList: [],

      //string
      movie_cat: "all",
      page: 1,
      filter: "popular",
      currentid: null,
      accountSelect: "None",
      currentAddress: "/",
      filterDisplay: "",
      //boolen
      isLogging: false,
      isLoading: false,
      liked: false,
      rated: false,

      //user info
      session_id: "",
      userName: "louislithta",
      userRate: 0,
      accountID: null
    };
  }

  fetchData = (url) => {
    fetch(url)
      .then((resp) => resp.json())
      .then((movie) => {
        this.setState({ movieList: movie.results });
      })
      .then(() => {
        this.setState({
          movieCard: [
            ...this.state.movieList.map((movie) => {
              return {
                title: movie.original_title,
                poster: movie.poster_path,
                rate: movie.vote_average,
                id: movie.id
              };
            })
          ]
        });
      });
  };
  componentDidMount() {
    this.fetchData(
      baseUrl + this.state.filter + apiKey + `&page=${this.state.page}`
    );
    if (localStorage.getItem("user")) {
      const userInfo = JSON.parse(localStorage.getItem("user"));

      this.setState(
        {
          ...this.state,
          session_id: userInfo.session_id,
          accountId: userInfo.accountId,
          userName: userInfo.userName,
          isLogging: true
        },
        () => {
          this.fetchLikeList();
          this.fetchRateList();
        }
      );
    }
  }

  handleDisplayList = (data) => {
    this.setState({ movie_cat: data });
    if (data === "liked" || data === "rated") {
      const next = {
        ...this.state,
        filterDisplay: "none",
        currentAddress: `/${data}`
      };
      this.setState(next);
    } else {
      const next = {
        ...this.state,
        filterDisplay: "",
        currentAddress: "/"
      };
      this.setState(next);
    }
  };

  handleSelect = (filter) => {
    this.setState({ filter: filter }, () => {
      this.fetchData(
        baseUrl + this.state.filter + apiKey + `&page=${this.state.page}`
      );
    });
  };
  handlePrev = (page) => {
    page === 1
      ? this.setState({ page: 1 })
      : this.setState({ page: page - 1 }, () => {
          this.fetchData(
            baseUrl + this.state.filter + apiKey + `&page=${this.state.page}`
          );
        });
  };
  handleNext = (page) => {
    // let newPage;
    page === 50
      ? this.setState({ page: 50 })
      : this.setState({ page: page + 1 }, () => {
          this.fetchData(
            baseUrl + this.state.filter + apiKey + `&page=${this.state.page}`
          );
        });

    // this.fetchData(baseUrl + this.state.filter + apiKey + `&page=${newPage}`);
  };
  handleClickTitle = (id) => {
    this.setState({ currentid: id });
  };
  fetchLikeList = () => {
    const url = `https://api.themoviedb.org/3/account/${this.state.accountID}/favorite/movies?api_key=31846cd2c427dd933fa6849953b3974d&session_id=${this.state.session_id}&sort_by=created_at.asc`;
    return fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.results) {
         
          this.setState({ likedList: data.results });
        }
      });
  };
  updataLikedCard = () => {
    const likedListCard = this.state.movieCard.filter((movie) => {
      if (this.state.likedList.some((id) => id === movie.id)) {
        return movie;
      }
    });
    this.setState({ likedListCard: likedListCard });
  };
  postLikeList = (id, move) => {
    return fetch(
      `https://api.themoviedb.org/3/account/${this.state.accountID}/favorite?api_key=31846cd2c427dd933fa6849953b3974d&session_id=${this.state.session_id}`,
      {
        method: "POST",
        body: JSON.stringify({
          media_type: "movie",
          media_id: id,
          favorite: move
        }),
        headers: { "content-type": "application/json;charset=utf-8" }
      }
    ).then((resp) => resp.json());
  };
  handleClickLike = (id) => {
    
    const likedMovie = this.state.movieList.find((movie) => movie.id === id);
    const liked = this.state.likedList.some(
      (movie) => movie.id === id
    );
    this.state.isLogging
      ? liked
        ? this.setState(
            {
              likedList: [
                ...this.state.likedList.filter(
                  (movie) => movie.id !== id
                )
              ]
            },
            () => {
              // this.updataLikedCard();
              this.postLikeList(id, false);
              // this.fetchLikeList();

              // this.postLikeList(560144);
            }
          )
        : this.setState(
            {
              ...this.state,
              likedList: [...this.state.likedList, likedMovie],
              liked: true,
            },
            () => {
              
              this.postLikeList(id, true)
            }
          )
      : alert("plz log in first");
  };
  handleCloseLike = () => {
    this.setState({ liked: false });
  };
  handleLogIn = () => {
    if (!this.state.session_id) {
      const next = {
        ...this.state,
        pageDisplay: "None",
        filterDisplay: "None",
        accountSelect: "None"
      };
      this.setState(next);
    } else {
      this.setState({
        ...this.state,
        pageDisplay: "",
        // filterDisplay: "",
        accountSelect: ""
      });
    }
  };
  handleAccount = (data) => {
    const next = {
      ...this.state,
      userName: data.userName,
      session_id: data.session_id,
      accountId: data.accountId,
      pageDisplay: data.session_id ? "" : "none",
      filterDisplay: data.session_id ? "" : "none",
      isLogging: true
    };
    this.setState(next, () => {
      this.fetchLikeList().then(() => {
        this.updataLikedCard();
      });
      this.fetchRateList();
      
    });
    localStorage.setItem(
      "user",
      JSON.stringify({
        session_id: this.state.session_id,
        accountId: this.state.accountId,
        userName: this.state.userName
      })
    );
  };
  handleLogOut = () => {
    this.setState({
      ...this.state,
      accountSelect: "none",
      session_id: "",
      userName: "",
      isLogging: false
      // currentAddress: "/"
    });
    localStorage.clear();
  };
  fetchRateList = () => {
    fetch(
      `https://api.themoviedb.org/3/account/${this.state.accountID}/rated/movies?api_key=31846cd2c427dd933fa6849953b3974d&language=en-US&session_id=${this.state.session_id}&sort_by=created_at.asc`
    )
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.results) {
         
          this.setState({ratedList: resp.results});
        }
      });
  };
  postRatedList = (rate, id) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=31846cd2c427dd933fa6849953b3974d&session_id=${this.state.session_id}`,
      {
        method: "POST",
        headers: { "content-type": "application/json;charset=utf-8" },
        body: JSON.stringify({ value: rate })
      }
    );
  };
  handleRate = (rate, id) => {
    this.postRatedList(rate, id)
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.success) {
          if (this.state.ratedList.some((movie) => movie.id === id)) {
            const newRate = this.state.ratedList.map((movie) => {
              if (movie.id === id) {
                return { ...movie, rating: rate };
              } else {
                return movie;
              }
            });
            this.setState({
              ...this.state,
              rated: true,
              ratedList: newRate
            });
          } else {
            const newRate = this.state.movieList.find((movie) => movie.id === id);
            this.setState({
              ...this.state,
              ratedList: [...this.state.ratedList, {newRate, rating: rate}],
              rated: true
            });
          }
        }
      })
      .then(() => {
        this.setState({ rateSuccess: false });
      });
  };
  handleCloseRate = () => {
    this.setState({ rated: false });
  };
  handleAddress = (address) => {
    this.setState({ currentAddress: address });
  };
  render() {
    return (
      // <Container>
        <BrowserRouter>
          <Header
            cataSelect={this.handleDisplayList}
            filterSelect={this.handleSelect}
            filterDisplay={this.state.filterDisplay}
            clickLike={this.handleLike}
            logIn={this.state.session_id ? true : false}
            userName={this.state.userName}
            loadLogIn={this.handleLogIn}
            logOutDisplay={this.state.accountSelect}
            logOut={this.handleLogOut}
          />
          <Snackbar
            open={this.state.liked}
            autoHideDuration={3000}
            onClose={this.handleCloseLike}
          >
            <Alert onClose={this.handleCloseLike} severity="success">
              Liked Success!
            </Alert>
          </Snackbar>
          <Snackbar
            open={this.state.rated}
            autoHideDuration={3000}
            onClose={this.handleCloseRate}
          >
            <Alert onClose={this.handleCloseRate} severity="success">
              Rate Success!
            </Alert>
          </Snackbar>

          <Switch>
            <Route
              path="/liked"
              render={() => {
                return (
                  <LikedListPage
                    isLogging={this.state.isLogging}
                    
                    likedList={this.state.likedList}
                    clickTitle={this.handleClickTitle}
                    clickLike={this.handleClickLike}
                    pageDisplay={"none"}
                    session_id={this.state.session_id}
                    accountID={this.state.accountID}
                  />
                );
              }}
            />

            <Route
              exact
              path="/"
              render={() => {
                return (
                  <CardContainer
                    movieCard={this.state.movieCard}
                    likedList={this.state.likedList}
                    clickTitle={this.handleClickTitle}
                    clickLike={this.handleClickLike}
                    page={this.state.page}
                    prevPage={this.handlePrev}
                    nextPage={this.handleNext}
                    isLogging={this.state.isLogging}
                  />
                );
              }}
            />

            <Route path="/log-in-page">
              {this.state.session_id ? (
                <Redirect to={`${this.state.currentAddress}`} />
              ) : (
                <LogInPage setAccount={this.handleAccount} />
              )}
            </Route>
            <Route
              path="/movie"
              render={() => {
                return (
                  <DetailPage
                    currentDetail={this.state.currentid}
                    session_id={this.state.session_id}
                    ratedList={this.state.ratedList}
                    isLogging={this.state.isLogging}
                    getAddress={this.handleAddress}
                    rate={this.handleRate}
                    rateSuccess={this.state.rateSuccess}
                  />
                );
              }}
            />
            <Route
              path="/rated"
              render={() => {
                return (
                  <RatedPage
                    isLogging={this.state.isLogging}
                    movieList={this.state.movieList}
                    ratedList={this.state.ratedList}
                    likedList={this.state.likedList}
                    clickTitle={this.handleClickTitle}
                    clickLike={this.handleClickLike}
                  />
                );
              }}
            />
            <Route path="/logout">
              <Redirect to={`${this.state.currentAddress}`} />
            </Route>
          </Switch>
          {/* </div> */}
        </BrowserRouter>
      // </Container>
    );
  }
}
