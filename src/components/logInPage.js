import React from "react";
import styled from "styled-components";
import Loader from "./loader";
import { Redirect, Link, Switch } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";



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
        this.setState({ session_id: resp.session_id });
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
          : this.setState({
              ...this.state,
              getError: true,
              isLoading: false
            });
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
      })
      .then(() => {
        this.setState({ isLoading: false }, () => {});
      });
  };

  render() {
    return (
      
        <div className="log-panel">
          <div className="log-in">
            <h1> Log In</h1>
            <div
              className="error-message"
              style={{ display: this.state.getError ? "" : "None" }}
            >
              Failed to log in
            </div>
            <div className="username">
              <TextField
              id="standard-basic"
              label="User Name"
              fullWidth="true"
              onChange={(e) => this.setState({ userName: e.target.value })}
            /></div>
            
            <div className="password">
              <TextField
              id="standard-basic"
              label="Password"
              fullWidth="true"
              onChange={(e) => {
                this.setState({ passWord: e.target.value });
              }}
              type="password"
            /></div>
            

            <Button
              variant="contained"
              color="primary"
              fullWidth="true"
              onClick={(e) => {
                this.getToken().then(() => {
                  this.getSessionId();
                });
              }}
            >
              {this.state.isLoading && <Loader />}
              {!this.state.isLoading && "log in"}
            </Button>
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
        </div>
      
    );
  }
}
