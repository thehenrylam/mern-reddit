import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import './App.css';

import "bootstrap/dist/css/bootstrap.min.css";

import store from "./store";

import authSetToken from "./util/auth/setToken.auth.util";
import { setCurrentUser, logoutUser } from "./actions/auth.action";

import Navbar from "./components/navbar.component";
import Main from "./components/main.component";
import Register from "./components/register.component";
import Login from "./components/login.component";
import Profile from "./components/profile.component";
import ProfileSettings from "./components/profile.settings.component";
import SearchResult from "./components/searchResult.component";
import FollowingList from "./components/followingList.component";
import FollowersList from "./components/followersList.component";

import {
  MAIN_PAGE_ENDPOINT,
  REGISTER_PAGE_ENDPOINT,
  LOGIN_PAGE_ENDPOINT,
  PROFILE_PAGE_ENDPOINT,
  PROFILESETTINGS_PAGE_ENDPOINT,
  PROFILEFOLLOWING_PAGE_ENDPOINT,
  PROFILEFOLLOWERS_PAGE_ENDPOINT,
  SEARCH_PAGE_ENDPOINT,
} from "./constants";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  authSetToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container" style={{marginTop: "2em", marginBottom: "2em"}}>
            <Switch>
              <Route exact path={MAIN_PAGE_ENDPOINT} component={Main} />
              <Route exact path={REGISTER_PAGE_ENDPOINT} component={Register} />
              <Route exact path={LOGIN_PAGE_ENDPOINT} component={Login} />
              <Route exact path={PROFILEFOLLOWING_PAGE_ENDPOINT + ':id'} component={FollowingList} />
              <Route exact path={PROFILEFOLLOWERS_PAGE_ENDPOINT + ':id'} component={FollowersList} />
              <Route exact path={PROFILESETTINGS_PAGE_ENDPOINT + ':id'} component={ProfileSettings} />
              <Route exact path={PROFILE_PAGE_ENDPOINT + ':id'} component={Profile} />
              <Route exact path={SEARCH_PAGE_ENDPOINT + ':searchTerm'} component={SearchResult} />
            </Switch>
          </div>
        </div>
      </Router>
    </Provider>
    );
  }
}

export default App;
