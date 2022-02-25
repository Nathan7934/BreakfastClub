import React from 'react';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import MainCommands from './../components/MainCommands';
import './Profile/profile.css';
import edit from './Profile/edit-solid.svg';
import {getUsers, checkSession, deleteUser} from './../actions/user';
import {createReport, deleteReport} from './../actions/report';
import {addFollowinginProfile, deleteFollowinginProfile } from "../actions/follow";

import Post from './../components/Post/index.js';
import EventPosts from './Events/EventPosts.js'
import profile from './Profile/profile.jpg';
import SearchBar from './../components/SearchBar';
import CreateEvent from './Events/CreateEvent';
import NewPost from './NewPost';


class Profile extends React.Component {
    state = {
        isFollow: false,
        isReported:false,
        isEvent: false,
        // isRestaurantFollow: false
        adminDeleted: false
    };

    // SetRestaurantFollow = (_isRestaurantFollow) => { this.setState({isRestaurantFollow: _isRestaurantFollow}) }
    SetEventButton = (_isEvent) => { this.setState({isEvent: _isEvent}) }
    SetFollowing = (_isFollow) => {this.setState({isFollow: _isFollow})}
    SetReported = (_isReported, reported, user) => {
        // const ReportedUser = reported[0].filter((flagged) => user.UserName === flagged.UserName)
        // will only be reported once into the array
        // if (_isReported && ReportedUser.length === 0) {
        //     this.SetRepUser(user)
        //     let newReport = reported
        //     newReport[0].push(this.state.RepUser)
        //     this.props.SetReportedState(newReport)
        // }
        const newReport = {
            contentId: user._id,
            contentOwner: user.name,
            contentType: "user"
        }
        createReport(newReport)
        // this.setState({isReported: _isReported})
    }

    findUserProfile = (userName, users) => {
        const searchedUser = users.filter((user) => userName === user.username)
        this.setState({
            userfound : searchedUser.length === 1
        })
        this.props.SetSearchedUser(searchedUser[0], searchedUser.length === 1)

    }

    // findFollowersUserProfile = (currentuser, follower, following) => {
    //     // console.log(currentuser)
    // }

    ReportButton = (isAdmin, isSearched, reported, user, users) => {
        if (!isAdmin) {
            if (isSearched){
                const inReported = (reported.filter((flagged) => user._id === flagged.contentId).length === 1)
                if (inReported) {
                    return(
                        <button id = {'reportButton'} disabled>
                            Reported!
                        </button>
                    );
                }
                else{
                    return(
                        <button onClick={() => this.SetReported(!this.state.isReported, reported, user)} id = {'reportButton'}>
                            !
                        </button>
                    );
                }
            }
        }
        else{
            if (isSearched){
                const inReported = (reported.filter((flagged) => user._id === flagged.contentId))
                
                const searchedUser = users.filter((u) => user.username === u.username)
                let userId= 0;
                if (searchedUser.length === 1) {
                userId = searchedUser[0]._id
                }
                if (inReported.length === 1) {
                    return (
                        <Button id = 'UserD' onClick={() => {deleteUser(userId, this); deleteReport(inReported[0]._id)}}>
                            {this.state.adminDeleted? "DELETED ✓": "DELETE USER"  }
                        </Button>
                    );
                }
                return (
                    <Button id = 'UserD' onClick={() => deleteUser(userId, this)}>
                        {this.state.adminDeleted? "DELETED ✓": "DELETE USER"  }
                    </Button>
                );
            }
        }

    }


    render() {
        const {app, user, appState, SetSearchedUser, SetPostsState, SetReportedState, SetIsFollowTargetRes} = this.props;
        const users = appState.users
        const sessionUser = appState.sessionUser
        const userProfile = user.profileInfo
        const isRestaurantFollow = appState.isFollowTargetRes
        const isSearched = (sessionUser.username !== user.username)
        const follower = (isRestaurantFollow) ? user.resfollowers : user.followers
        const following = (isRestaurantFollow) ? user.resfollowing : user.following
        const followTarget = (isRestaurantFollow) ? 'foodie' : 'restaurant'

        return (
            <div id ='backcolor'>

                <MainCommands app ={app} isRstrnt={sessionUser.isRstrnt} isAdmin ={sessionUser.isAdmin}/>
                <SearchBar users={users} SetSearchedUser = {SetSearchedUser} />

                <div id = 'Structure'>
                    <div id = 'Profile'>
                        <img src={profile} alt='profile' id='Profilepic' />

                        <h3>
                            {user.name}
                            <span class='grey'> @{user.username}</span>
                            {this.ReportButton(sessionUser.isAdmin, isSearched, appState.reported, user, users)}

                        </h3>


                        <Button id = 'followButton' onClick={() => { (isRestaurantFollow) ? SetIsFollowTargetRes(false) : SetIsFollowTargetRes(true) }} ><span>{ followTarget }</span></Button>

                        <Link to={"./Following"} className = {"LinkStyle"} onMouseEnter = {() => SetSearchedUser(user, 1)}>
                            <Button>{following.length} Following</Button>
                        </Link>

                        <Link to={"./Followers"} className = {"LinkStyle"} onMouseEnter = {() => SetSearchedUser(user, 1)}>
                            < Button>{follower.length} Followers</Button>
                        </Link>
                        <FollowEditButton 
                        isFollow ={this.state.isFollow} 
                        SetFollowing ={this.SetFollowing} 
                        isSearched ={isSearched}
                        searchedUser = {appState.searchedUser}
                        sessionUser = {appState.sessionUser}
                        app = {app}
                        />
                        <div id = 'ProfileInfo'>
                            <p>Bio: {userProfile.bio}</p>
                            <p>Location: {userProfile.location}</p>
                            <p>Keywords: <span><i>{userProfile.keywords.toString()}</i> </span></p>
                        </div>
                    </div>

                    <div>
                        <Button onClick={() => this.SetEventButton(false)} id = {"ButtonTab"}>Posts</Button>
                        <Button onClick={() => this.SetEventButton(true)} id = {"ButtonTab"}>Events</Button>
                    </div>

                    <UserWall
                        isEvent ={this.state.isEvent}
                        appState = {appState}
                        user ={user}
                        isCurrent = {!isSearched}
                        SetSearchedUser = {SetSearchedUser}
                        SetPostsState = {SetPostsState}
                        SetReportedState = {SetReportedState}
                    />
                </div>
            </div>
        );
    }
}

class FollowEditButton extends React.Component{
    render(){
        const {isFollow, SetFollowing, isSearched, searchedUser, sessionUser, app} = this.props;
        const sessionUserFollowing = (searchedUser.isRstrnt) ? sessionUser.resfollowing : sessionUser.following
        // console.log(sessionUserFollowing)
        // console.log((sessionUserFollowing.filter(e => e.username === sessionUser.username).length > 0))
        if (isSearched){
            return(
                <span>
                    <Button onClick={() =>  { (sessionUserFollowing.filter(e => e.username === searchedUser.username).length > 0) ? 
                        deleteFollowinginProfile(searchedUser.isRstrnt, app, sessionUser.username, searchedUser.username) : 
                        addFollowinginProfile(searchedUser.isRstrnt, app, sessionUser._id, searchedUser.name, searchedUser.username)
                    }}>
                        {(sessionUserFollowing.filter(e => e.username === searchedUser.username).length > 0) ? "Followed ✓": "Follow"  }
                    </Button>

                </span>
            );
        }

        return (<span id ="editPButton">
            <Link to={"./EditProfileInfo"} className = {"LinkStyle"}>
                <Button><img src={edit} alt="Edit Icon" id='editIcon'/></Button>
            </Link> <br/>
        </span>)
    }
}

class UserWall extends React.Component{
    state ={
        isCollapsed: true
    }
    SetCollapsed = (_isCollapsed) => { this.setState({isCollapsed: _isCollapsed}) }
    CreateButton = (isEvent, appState, SetPostsState, user, isCurrent) => {
        if (isCurrent) {
            if (isEvent && user.isRstrnt) {
                if (this.state.isCollapsed){
                    return(
                        <div id ='newPostCollapsed'>
                            <h3 id = 'collapsedPrompt'>What kind of event are you brewing? <span><button onClick={() => this.SetCollapsed(false)} class='expandButton'>Create Event</button></span></h3>
                        </div>
                    )
                }

                else{
                    return(
                        <>
                        <button onClick={() => this.SetCollapsed(true)} class='collapseEPButton'>Exit</button>
                        <CreateEvent
                            owner={user.username}
                            mode='create'
                        />
                        </>
                    );
                }
            }
            else if(!isEvent){
                return(
                    <NewPost posts={appState.posts} SetPostsState={SetPostsState} currentUser={user}/>
                )
            }

        }

        return(
            <>
            </>
        )
    }

    render(){
        const {isEvent, appState, user, isCurrent, SetSearchedUser, SetPostsState, SetReportedState} = this.props;
        // const currentUser = appState.currentUser
        // const isCurrent = (currentUser.UserName == currentProfile.UserName)
        const userPosts = appState.posts.filter((post) => post.userName === user.username)

        if(isEvent){
            return(
                <>
                    {this.CreateButton(isEvent, appState, SetPostsState, user, isCurrent)}
                    <EventPosts appState={appState} user={user} SetSearchedUser={SetSearchedUser}/>
                </>
            )
        }
        if(userPosts.length != 0){
            return(
                <div>
                    {this.CreateButton(isEvent, appState, SetPostsState, user, isCurrent)}
                    {userPosts.slice(0).reverse().map(post => (
                    <Post
                        id={post.id}
                        userName={post.userName}
                        text={post.text}
                        restaurant={post.restaurant}
                        image={post.image}
                        ownedByUser={isCurrent}
                        posts={appState.posts}
                        users = {appState.users}
                        reported = {appState.reported}
                        SetSearchedUser = {SetSearchedUser}
                        SetReportedState= {SetReportedState}
                        isAdmin = {appState.sessionUser.isAdmin}
                    />
                ))}
              </div>
            );
        }
        else{
            return(
                <>
                {this.CreateButton(isEvent, appState, SetPostsState, user, isCurrent)}

                <div id = 'noPost'>
                    <h4>{user.name} has not made any posts yet!</h4>
                </div>
                </>
            )

        }



    }
}
export default Profile;
