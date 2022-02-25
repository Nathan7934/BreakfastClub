import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import './Login.css'
import LogInbanner from './breakfastclubanner.png'
/* Unfinished login view. Current functionality is only placeholder */
class Login extends React.Component {

    render() {
        const {SetIsAdminState} = this.props;
        return (
            <div className ='center'>
                <img src = {LogInbanner} alt= 'breakfast club banner' id ='loginpic'/>
                <br/>
                <Link to={"./UserInput"}>
                    <Button id='userButton' onClick={() => SetIsAdminState(false)}>User Login</Button>
                    <Button id='adminButton'onClick={() => SetIsAdminState(true)}>Admin Login</Button>
                </Link>
                <br/>
                <Link to={"./SignupForm"}>
                    <input type="submit" value="Create New Account"/>
                </Link>
            </div>
        );
    }
}

export default Login;