import React from "react";
import styled from "styled-components";
import Loader from "./loader";
import { Redirect, Link, Switch } from "react-router-dom";

const Container = styled.div`
  width: 400px;
  margin: auto;
`;

export default class FetchLogInData extends React.Component {
  state = {
    userName: "louislithta",
    passWord: "Mwh@1996",
    request_token: "",
    session_id: "",
    isLoading: false,
    getError: false
  };
  shouldComponentUpdate() {
    if (
      this.state.session_id !== "" ||
      this.state.isLoading === true ||
      this.state.getError
    ) {
      return true;
    } else {
      return false;
    }
  }
  componentDidUpdate(prev) {
    if (this.state.session_id !== "") {
      this.fetchAccount();
    }
  }

  // componentWillUnmount(){
  //   const next = {...this.state, user}
  // }

  fetchSessionId = () => {
    return fetch(
      "https://api.themoviedb.org/3/authentication/session/new?api_key=31846cd2c427dd933fa6849953b3974d",
      {
        method: "POST",
        body: JSON.stringify({
          request_token: `${this.state.request_token}`
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        console.log("session", resp);
        this.setState({ session_id: resp.session_id }, () => {
          console.log(this.state.session_id);
        });
      });
  };
  getToken = () => {
    this.setState({ isLoading: true });
    return fetch(
      "https://api.themoviedb.org/3/authentication/token/new?api_key=31846cd2c427dd933fa6849953b3974d"
    )
      .then((resp) => resp.json())
      .then((resp) => {
        this.setState({ request_token: resp.request_token }, () => {});
      });
  };
  getSessionId = () => {
    console.log({
      username: `${this.state.userName}`,
      password: `${this.state.passWord}`,
      request_token: `${this.state.request_token}`
    });
    return fetch(
      "https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=31846cd2c427dd933fa6849953b3974d",
      {
        method: "POST",
        body: JSON.stringify({
          username: `${this.state.userName}`,
          password: `${this.state.passWord}`,
          request_token: `${this.state.request_token}`
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
    )
      .then((resp) => resp.json())
      .then((resp) => {
        resp.success
          ? this.fetchSessionId().then(() => {
              this.setState({
                ...this.state,
                getError: this.state.session_id === "",
                isLoading: false
              });
            })
          : this.setState(
              {
                ...this.state,
                getError: true,
                isLoading: false
              },
              () => {
                console.log(this.state.getError);
              }
            );
      });
  };
  fetchAccount = () => {
    fetch(
      `https://api.themoviedb.org/3/account?api_key=31846cd2c427dd933fa6849953b3974d&session_id=${this.state.session_id}`
    )
      .then((resp) => resp.json())
      .then((resp) => {
        this.props.setAccount({
          userName: resp.username,
          session_id: this.state.session_id,
          accountId: resp.id
        });
        console.log("account", resp);
      })
      .then(() => {
        this.setState({ isLoading: false }, () => {});
      });
  };

  render() {
    return (
      <Container>
        <div className="log-panel">
          <h1> Log In</h1>
          <div
            className="error-message"
            style={{ display: this.state.getError ? "" : "None" }}
          >
            Failed to log in
          </div>
          <h2>User Name</h2>
          <input
            onChange={(e) => {
              this.setState({ userName: e.target.value });
            }}
          />
          <h2>Password</h2>
          <input
            onChange={(e) => {
              this.setState({ passWord: e.target.value });
            }}
            // type="password"
          />

          <button
            onClick={(e) => {
              this.getToken().then(() => {
                this.getSessionId();
              });
            }}
          >
            {this.state.isLoading && <Loader />}
            {!this.state.isLoading && "log in"}
          </button>
          <Link to="/">
            <div
              className="success"
              style={{ display: this.state.session_id ? "" : "none" }}
              onClick={(e) => this.fetchAccount()}
            >
              &#10003;Log In Success. if not redirect, click to redirect...
            </div>
          </Link>
        </div>
      </Container>
    );
  }
}
