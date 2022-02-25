import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import './Login.css'
import LogInbanner from './breakfastclubanner.png'
import UserInput from "./UserInput";
import EditProfileInfo from "./EditProfileInfo";

import { signUp, getUsers } from "../actions/user";


class SignupForm extends React.Component {

    state = {
      name: "",
      username: "",
      password: "",
      signupMessage: "",
      usernameValid: false,
      isRestaurant: false,
      success: false,
      newUser : {
        name: '',
        username: '',
        password:'',
        isAdmin: false,
        isRstrnt: null,
        followers:[],
        following:[],
        resfollowing: [],
        resfollwers: [],
        profileInfo: {bio: '',
        location: '',
        keywords: []}},
      users: []

    }

    loadUsers = async () => {
        const users = await getUsers();
        if (users) {
            this.setState({users: users});
        }
    }

    // handle name input and check if all inputs are filled and valid
    handleNameChange = (event, users) => {
      const value = event.target.value
      this.setState({name: value})
    }

    // handle username input, check that username isn't taken, and check if all inputs are filled and valid
    handleUsernameChange = (event) => {
      this.loadUsers();
      const users = this.state.users
      const value = event.target.value
      this.setState({username: value}, () => {
        const usernameMatch = users.filter((user) => this.state.username === user.username)
        if (usernameMatch.length !== 0 || this.state.username.length === 0) {
          this.setState({
            signupMessage: "Username already taken. Please try again.",
            usernameValid: false
          })
        } else {
          this.setState({
            signupMessage: "",
            usernameValid: true
          })
        }

      })
    }

    // handle password input and check if all inputs are filled and valid
    handlePasswordChange = (event, users) => {
      const value = event.target.value
      this.setState({password: value})
    };

    // handle restaurant checkbox change
    handleCheckboxChange = (event) => {
      if (this.state.isRestaurant) {
        this.setState({isRestaurant: false})
      } else {
        this.setState({isRestaurant: true})
      }
    }

    // check if all inputs are filled and valid, set this.state.sucess to 'true' if that's the case
    checkInputComplete = (appState) => {
      if (this.state.usernameValid && this.state.name.length !== 0 && this.state.password.length !== 0) {
        this.state.newUser.name = this.state.name
        this.state.newUser.username = this.state.username
        this.state.newUser.password = this.state.password
        this.state.newUser.isRstrnt = this.state.isRestaurant
          
        
        // this.state.newUserInfo.id = profileInfo.length
        // this.state.newUserInfo.UserName = this.state.username
        // users.push(newUser)
        // signUp(newUser)
        // profileInfo.push(this.state.newUserInfo)
        // this.props.UpdateProfileInfoState(pinfo)
        // this.props.SetCurrentUser(newUser)
        this.setState({signupMessage: "",success: true})
      } else {
        this.setState({
          signupMessage: "Invalid username or name. Please try again.",
          success: false})
      }
    }


    render() {
      const {app, appState, SetSearchedUser} = this.props
      if (!this.state.success) {
        return (
          <div className = 'center'>
            <Link to={"./"}>
              <img src = {LogInbanner} alt= 'breakfast club banner' id ='loginpic'/>
            </Link>
            <h1 className="title"> Create New Account</h1>
            <form>
              <div>
                <label>{this.state.isRestaurant? "Restaurant": ""} Name </label>
                <input
                  type="text"
                  value={this.state.name}
                  onChange={(event) => this.handleNameChange(event, appState.users)}
                />
              </div>
              <div className ="topmargin">
                <label>Username </label>
                <input
                  type="text"
                  value={this.state.username}
                  onChange={(event) => this.handleUsernameChange(event)}
                />
              </div>
              <div className ="topmargin">
                <label id = "password">Password </label>
                <input
                  type="text"
                  value={this.state.password}
                  onChange={(event) => this.handlePasswordChange(event, appState.users)}
                />
              </div>
              <div className ="topmargin">
                <label>Are You a Restaurant Owner?</label>
                <input
                  type="checkbox"
                  checked={this.state.isRestaurant}
                  onChange={this.handleCheckboxChange}
                />
              </div>
              <div className ="topmargin">

                    <Button onClick ={() => this.checkInputComplete(appState)}>
                      Sign Up
                    </Button>
                <p>{this.state.signupMessage}</p>
              </div>
            </form>
          </div>
        );
      }
      return(
        <EditProfileInfo
        app = {app}
        user ={this.state.newUser}
        appState ={appState}
        firstTime = {true}
        SetSearchedUser = {SetSearchedUser}/>
      )

    }
}


export default SignupForm;
