import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import '../index.css'
import Profile from "./Profile";

class SearchedUser extends React.Component{

    render() {
        const {app, user, appState, SetSearchedUser, SetPostsState, SetReportedState, SetIsFollowTargetRes} = this.props;
        return (
          <Profile
            app = {app}
            user = {user}
            appState={appState}
            SetSearchedUser = {SetSearchedUser}
            SetPostsState ={SetPostsState}
            SetReportedState={SetReportedState}
            SetIsFollowTargetRes={SetIsFollowTargetRes}/>
        )
      }
  }

export default SearchedUser;
