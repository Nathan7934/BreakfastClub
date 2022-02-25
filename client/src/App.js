import React from 'react';

import logo from './logo.svg';
import './App.css';

import { Route, Switch, BrowserRouter } from 'react-router-dom';
import {getUsers, checkSession} from './actions/user';

import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Profile from './views/Profile';
import NewPost from './views/NewPost';
import Events from './views/Events/Events';
import Following from './views/Following';
import Followers from './views/Followers';
import UserInput from './views/UserInput';
import SignupForm from './views/SignupForm';
import UserNotFound from './views/UserNotFound';
import SearchedUser from './views/SearchedUser';
import EditProfileInfo from './views/EditProfileInfo'
import Reported from './views/Reported';
import { getReports } from './actions/report';


class App extends React.Component {

  state = {
    // true: restaurant, false: foodie
    isFollowTargetRes: false,
    users:[],

    posts: [
      {
        id: 0,
        userName: "user1",
        text: "Delicious food! Great service and loved the atmosphere. Highly recommend!",
        restaurant: "Fresh Restaurants",
        image: "https://res.cloudinary.com/dtcpnk7py/image/upload/v1636252895/csc309_project/ikgsricx6ke3gn1a4it1.jpg"
      },
      {
        id: 1,
        userName: "user2",
        text: "Check out our pasta! We're open Mon-Fri 11AM-10PM.",
        restaurant: "Terroni",
        image: "https://res.cloudinary.com/dtcpnk7py/image/upload/v1636252954/csc309_project/snvhdapzjzf85i7lybbo.jpg"
      },
      {
        id: 2,
        userName: "user3",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco",
        restaurant: "Restaurant",
        image: "https://res.cloudinary.com/dtcpnk7py/image/upload/v1636252940/csc309_project/dwpoakx7xmzxxurpbbqc.jpg"
      }
    ],
    // reported contains 3 nested list:
    // first list contains reported user, second contains reported post, third contains reported event
    // should implement further in phase 2
    reported:[],
    sessionUser: null,

    searchedUser: {
      _id : '',
      name: '', 
      username: '',
      isAdmin: null,
      isRstrnt: null,
      following:[],
      followers:[],
      resfollowing:[],
      resfollowers:[],
      profileInfo: {
          bio: "",
          location:"",
          keywords: []
      }
  }
    // modify data after phase 1
    // probably need to add another attritube [] -> lst of following
  };

  SetPostsState = (_posts) => { this.setState({posts: _posts})}

  SetIsFollowTargetRes = (_isFollowTargetRes) => { this.setState({isFollowTargetRes: _isFollowTargetRes}) }

  SetReportedState = (_reported) => {
        this.setState({reported: _reported})

          }


  SetSearchedUser = (user, success) => {
    if(success){
      const searchedUser = this.state.searchedUser
      searchedUser._id = user._id
      searchedUser.name = user.name
      searchedUser.username = user.username
      searchedUser.isRstrnt = user.isRstrnt
      searchedUser.following = user.following
      searchedUser.followers = user.followers
      searchedUser.resfollowing = user.resfollowing
      searchedUser.resfollowers = user.resfollowers
      searchedUser.profileInfo.bio = user.profileInfo.bio
      searchedUser.profileInfo.location= user.profileInfo.location
      searchedUser.profileInfo.keywords= user.profileInfo.keywords

    }
  }

  // -------------------SESSION CHECKING---------------------
//   loadUsers = async () => {
//     const users = await getUsers();
//     const reported = await getReports();
//     if (users) {
//         this.setState({users: users});
//     }
//     if (reported) {
//       this.setState({reported: reported});
//   }
  
// }

  componentDidMount() {
    checkSession(this); // sees if a user is logged in
    getUsers(this);
    getReports(this);
  }

  render() {
    const currentUser = this.state.sessionUser;

    return (
      <div>
        <BrowserRouter>
          {/* Different views go here */}
          <Switch>

          {/*==================== LOGIN VIEWS ====================*/}

            <Route exact path='/SignupForm' render={() => (<SignupForm
              app = {this}
              appState={this.state}
              SetSearchedUser = {this.SetSearchedUser}
              />)}/>


            {/* <Route exact path='/UserInput' render={() => ( */}

            {/* //<Login SetIsAdminState={this.SetIsAdminState}/> */}
              <Route exact path= {["/", "/login", "/dashboard"]}
              render={props => (
                <>
                { !currentUser ?
                <UserInput
                app = {this}
                appState = {this.state}/>:
                <Dashboard
                app = {this}
                appState = {this.state}
                reported = {this.state.reported}
                SetSearchedUser = {this.SetSearchedUser}
                SetPostsState={this.SetPostsState}
                SetReportedState = {this.SetReportedState}

                />}
                </>
                )}
                />


            {/*================== DASHBOARD VIEWS ===================*/}

            {/* <Route exact path='/Dashboard' render={() => (<Dashboard
                appState = {this.state}
                reported = {this.state.reported}
                SetSearchedUser = {this.SetSearchedUser}
                SetPostsState={this.SetPostsState}
                SetReportedState = {this.SetReportedState}

                />)}/> */}

            <Route exact path='/NewPost' render={() => (<NewPost
              isRstrnt = {this.sessionUser.isRstrnt}
              isAdmin = {this.state.sessionUser.isAdmin}

              users={this.state.users}
              SetSearchedUser = {this.SetSearchedUser}

            />)}/>

            {/*==================== EVENT VIEWS ====================*/}

            <Route exact path='/Events' render={() => (<Events
              app={this}
              SetSearchedUser = {this.SetSearchedUser}
            />)}/>

            {/*=================== PROFILE VIEWS ====================*/}

            <Route exact path='/Profile' render={() => (<Profile
              app = {this}
              user = {this.state.sessionUser}
              appState = {this.state}
              SetSearchedUser = {this.SetSearchedUser}
              SetPostsState = {this.SetPostsState}
              SetReportedState = {this.SetReportedState}
              SetIsFollowTargetRes = {this.SetIsFollowTargetRes}
              />)}/>

            <Route exact path='/EditProfileInfo' render={() => (<EditProfileInfo
              app = {this}
              user = {this.state.sessionUser}
              appState = {this.state}
              firstTime = {false}
              SetSearchedUser = {this.SetSearchedUser}
              />)}/>

            <Route exact path='/Following' render={() => (<Following
              app ={this}
              isRstrnt = {this.state.sessionUser.isRstrnt}
              isAdmin = {this.state.sessionUser.isAdmin}
              users={ this.state.users}
              SetSearchedUser = {this.SetSearchedUser}
              currentUser = {this.state.sessionUser}
              appState = {this.state}
              searchedUser = {this.state.searchedUser}/>
            )}/>
            <Route exact path='/Followers' render={() => (<Followers
              app = {this}
              isRstrnt = {this.state.sessionUser.isRstrnt}
              isAdmin = {this.state.sessionUser.isAdmin}
              users={ this.state.users}
              SetSearchedUser = {this.SetSearchedUser}
              currentUser = {this.state.sessionUser}
              appState = {this.state}
              searchedUser = {this.state.searchedUser}/>
              )}/>

            {/*================= USER SEARCH VIEWS ==================*/}

            <Route exact path='/UserNotFound' render={() => (
              <UserNotFound
                app = {this}
                isRstrnt = {this.state.sessionUser.isRstrnt}
                isAdmin = {this.state.sessionUser.isAdmin}
                users={this.state.users}
                SetSearchedUser = {this.SetSearchedUser}
                />)}/>

            <Route exact path='/SearchedUser' render={() => (<SearchedUser
              app = {this}
              user = {this.state.searchedUser}
              isAdmin = {this.state.sessionUser.isAdmin}
              appState = {this.state}
              SetSearchedUser = {this.SetSearchedUser}
              SetPostsState = {this.SetPostsState}
              SetReportedState = {this.SetReportedState}
              SetIsFollowTargetRes = {this.SetIsFollowTargetRes}
              />)}/>
              
            {/*================= ADMIN VIEWS ==================*/}

            <Route exact path='/Reported' render={() => (
              <Reported
                app = {this}
                isRstrnt = {this.state.sessionUser.isRstrnt}
                isAdmin = {this.state.sessionUser.isAdmin}
                users={this.state.users}
                SetSearchedUser = {this.SetSearchedUser}
                />)}/>


              <Route render={() => <div>404 Not found</div>} />
          </Switch>

        </BrowserRouter>
      </div>
    );
  }
}

export default App;
