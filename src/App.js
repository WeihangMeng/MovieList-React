import "./styles.css";
import React from "react";
import Header from "./components/header";
import styled from "styled-components";
import CardContainer from "./components/container";
import { Redirect, BrowserRouter, Route, Link, Switch } from "react-router-dom";
import LikedListPage from "./components/likedLIstPage";
import Loader from "./components/loader";
import RatedPage from "./components/ratedPage";
import LogInPage from "./components/logInPage";
import DetailPage from "./components/detailPage";

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
      movieList: [],
      isLoading: false,
      movie_cat: "all",

      page: 1,
      likedListCard: [],
      filter: "popular",
      movieCard: [],
      likedList: [],
      ratedList: [],
      currentid: null,
      userRate: 0,
      isLogging: false,
      userName: "",
      session_id: "",
      accountSelect: "None",
      currentAddress: "/",
      accountID: 9970422,
      rateSuccess: false
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
      // console.log(localStorage.getItem("user"));
      const userInfo = JSON.parse(localStorage.getItem("user"));
      // console.log("mount", JSON.parse(userInfo));
      this.setState(
        {
          ...this.state,
          session_id: userInfo.session_id,
          accountId: userInfo.accountId,
          userName: userInfo.userName,
          isLogging: true
        },
        () => {
          this.fetchLikeList().then(() => {
            this.updataLikedCard();
          });
          this.fetchRateList();
        }
      );
    }
  }
  // componentDidUpdate(prev) {
  //   // this.fetchLikeList();
  //   if (this.state.isLogging && this.state.likedList !== prev.likedList) {
  //     this.fetchLikeList().then(() => {
  //       this.updataLikedCard();
  //     });
  //     //
  //     if(this.state.isLogging && this.state.ratedList !== prev.ratedList){
  //       this.fetchRateList();
  //     }
  //   }
  // }

  handleDisplayList = (data) => {
    this.setState({ movie_cat: data });
    if (data === "liked" || data === "rated") {
      const next = {
        ...this.state,

        currentAddress: `/${data}`
      };
      this.setState(next);
    } else {
      const next = {
        ...this.state,

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
    this.setState({ currentid: id }, () => {
      console.log(this.state.currentdetail);
    });
  };
  fetchLikeList = () => {
    const url = `https://api.themoviedb.org/3/account/${this.state.accountID}/favorite/movies?api_key=31846cd2c427dd933fa6849953b3974d&session_id=${this.state.session_id}&sort_by=created_at.asc`;
    console.log(url);
    return fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.results) {
          const likedidList = data.results.map((movie) => movie.id);
          this.setState({ likedList: likedidList });
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
    fetch(
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
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      });
  };
  handleClickLike = (id) => {
    const likedMovie = this.state.movieCard.find((movie) => movie.id === id);
    // console.log(likedMovie);
    const liked = this.state.likedList.some(
      (movieid) => movieid === likedMovie.id
    );
    this.state.isLogging
      ? liked
        ? this.setState(
            {
              likedList: [
                ...this.state.likedList.filter(
                  (movieid) => movieid !== likedMovie.id
                )
              ]
            },
            () => {
              this.updataLikedCard();
              this.postLikeList(id, false);

              // this.postLikeList(560144);
            }
          )
        : this.setState(
            { likedList: [...this.state.likedList, likedMovie.id] },
            () => {
              this.updataLikedCard();
              this.postLikeList(id, true);
            }
          )
      : alert("plz log in first");
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
      console.log("app's state:", this.state.userName);
      console.log("app", this.state.session_id);
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
    console.log("localstorage", localStorage.getItem("user"));
  };
  handleLogOut = () => {
    this.setState(
      {
        ...this.state,
        accountSelect: "none",
        session_id: "",
        userName: "",
        isLogging: false
        // currentAddress: "/"
      },
      () => {
        console.log(this.state.currentAddress);
      }
    );
    localStorage.clear();
  };
  fetchRateList = () => {
    fetch(
      `https://api.themoviedb.org/3/account/${this.state.accountID}/rated/movies?api_key=31846cd2c427dd933fa6849953b3974d&language=en-US&session_id=${this.state.session_id}&sort_by=created_at.asc`
    )
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.results) {
          const ratedList = resp.results.map((movie) => {
            return { rate: movie.rating, id: movie.id };
          });
          this.setState({ ratedList: ratedList }, () => {
            console.log(this.state.ratedList);
          });
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
    // .then((resp) => resp.json())
    // .then((data) => {
    //   console.log(data);
    // });
  };
  handleRate = (rate, id) => {
    this.postRatedList(rate, id)
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.success) {
          if (this.state.ratedList.some((movie) => movie.id === id)) {
            const newRate = this.state.ratedList.map((movie) => {
              if (movie.id === id) {
                return { rate: rate, id: id };
              } else {
                return movie;
              }
            });
            console.log(newRate);
            this.setState({
              ...this.state,
              rateSuccess: true,
              ratedList: newRate
            });
          } else {
            this.setState({
              ...this.state,
              ratedList: [...this.state.ratedList, { rate: rate, id: id }],
              rateSuccess: true
            });
          }
        }
      })
      .then(() => {
        this.setState({ rateSuccess: false });
      });
  };
  handleRateSuccess = () => {
    setInterval(this.setState({ rateSuccess: false }), 5000);
    // this.setState({ rateSuccess: false });
  };
  handleAddress = (address) => {
    this.setState({ currentAddress: address });
  };
  render() {
    return (
      <Container>
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

          {/* <div className="container"> */}
          <Switch>
            {/* <CardContainer
            movieCard={this.state.movieCard}
            likedList={this.state.likedList}
            clickTitle={this.handleClickTitle}
            clickLike={this.handleClickLike}
            /> */}
            <Route
              path="/liked"
              render={() => {
                return (
                  <LikedListPage
                    // likeListCard={this.state.likedList}
                    // clickTitle={this.handleClickTitle}
                    // clickLike={this.handleClickLike}
                    // page={this.state.page}
                    // prevPage={this.handlePrev}
                    // nextPage={this.handleNext}
                    isLogging={this.state.isLogging}
                    movieCard={this.state.movieCard}
                    likedList={this.state.likedList}
                    clickTitle={this.handleClickTitle}
                    clickLike={this.handleClickLike}
                    pageDisplay={"none"}
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
                    likedList={this.state.likedListCard}
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
            {/* <Route path="/rated" component={RatedPage} /> */}
            {/* <Route
              path="/log-in-page"
              render={() => {
                return <LogInPage setAccount={this.handleAccount} />;
              }}
            /> */}
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
                    likedList={this.state.likedListCard}
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
      </Container>
    );
  }
}
