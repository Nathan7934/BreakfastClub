import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import './Login.css'
import LogInbanner from './breakfastclubanner.png'
import { login, getUsers } from "../actions/user";

/* Unfinished login view. Current functionality is only placeholder */
class UserInput extends React.Component {

    state = {
        username: '',
        password: '',
        validated: false,
        loginMessage:''
    }

    // handle username input 
    handleUsernameChange = (event) => {
      const value = event.target.value
      this.setState({username: value})

    }

    // handle password input
    handlePasswordChange = (event) => {
      const value = event.target.value
      this.setState({password: value})

    }
    refresh() {
      window.location.reload(false);
    }

    render() {
        const {app, appState} = this.props;
        const isAdmin = appState.isAdmin;
        return (
          <div className = 'center'>
            <Link to={"./"}>
              <img src = {LogInbanner} alt= 'breakfast club banner' id ='loginpic'/>
            </Link>
            <h4 className="title">{isAdmin ? 'Admin' : 'User'} Login</h4>

            <input type="text"
              name="userName"
              placeholder="User Name"
              id = "spacers"
              text={this.state.username}
              onChange={(event) => this.handleUsernameChange(event)}
            />

            <input type="password"
              name="password"
              placeholder="Password"
              id = "spacers"
              text={this.state.password}
              onChange={(event) => this.handlePasswordChange(event)}
            />
            <Link to={"./dashboard"} >
              <input
                type="submit"
                id='adminButton'
                value = "login"
                onClick={() => login(this, app)}
              />
            </Link>


            <p>{this.state.loginMessage}</p>
            <br/>
                <Link to={"./SignupForm"}>
                    <input type="submit" value="Create New Account"/>
                </Link>
          </div>
        )
      };
    }


export default UserInput;
