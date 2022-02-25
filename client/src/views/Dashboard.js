import React from 'react';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import MainCommands from './../components/MainCommands';
import SearchBar from './../components/SearchBar';
import DashboardTimeline from './../components/DashboardTimeline/index';
import {getUsers, checkSession} from './../actions/user';

class Dashboard extends React.Component {
    state={
        users:[]
    }

    render() {
        const {app, appState, reported, SetSearchedUser, SetPostsState, SetReportedState} = this.props;

        return (
            <div>
                <MainCommands app ={app} isRstrnt={appState.sessionUser.isRstrnt} isAdmin ={appState.sessionUser.isAdmin}/> <br/>
                <SearchBar users={appState.users} SetSearchedUser = {SetSearchedUser}/>

                <DashboardTimeline
                    posts={appState.posts}
                    users ={appState.users}
                    reported = {reported}
                    SetSearchedUser = {SetSearchedUser}
                    SetPostsState={SetPostsState}
                    SetReportedState={SetReportedState}
                    currentUser={appState.sessionUser}
                    isAdmin={appState.sessionUser.isAdmin}
                    />

            </div>
        );
    }
}

export default Dashboard;
