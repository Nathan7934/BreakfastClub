import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import MainCommands from './../components/MainCommands';
import SearchBar from './../components/SearchBar';

class UserNotFound extends React.Component {
    render () {
        const {app, isRstrnt, isAdmin, users, SetSearchedUser} = this.props;
        return (
          <div>
            <MainCommands app ={app} isRstrnt={isRstrnt} isAdmin={isAdmin}/> <br/>
            <SearchBar users={users} SetSearchedUser = {SetSearchedUser}/>
            <h3>Username not found. Please try again.</h3>
          </div>
        )
    }
}

export default UserNotFound;
