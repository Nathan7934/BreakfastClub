import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import '../index.css'
import logo from './bclogo.png'
import logo2 from './bclogo2.png'
import banner from './../views/breakfastclubentry.png'
import {logout} from './../actions/user';
import App from "../App";

class MainCommands extends React.Component {
    // refresh() {
    //     window.location.reload(false);
    //   }
    render() {
      const {app, isRstrnt, isAdmin} = this.props;
      if (isAdmin) {
        return (
            <div className = 'commands'>
                <h3>Breakfast Club</h3>
                <Link to={"./Dashboard"}>
                    <img src = {logo2} alt= 'breakfast club logo' id ='logobutton'/>
                </Link>
                <h4 class = 'usertracker'>Admin view </h4>

                {///There might be better way to implement superuser feature
                ///Possibly add reports as superuser feature
                }
                <Link to ={"./Reported"}>
                    <Button>Reported</Button>
                </Link>

                <Link to={"./Dashboard"}>
                    <Button>Dashboard</Button>
                </Link> <br/>
                <Link to={"./Profile"}>
                    <Button>Profile</Button>
                </Link> <br/>
                <Link to={"./Events"}>
                    <Button>Upcoming Events</Button>
                </Link> <br/>
                <Link to={"./"} >
                    <Button onClick={() => logout(app)}>Logout</Button>
                </Link> <br/>
            </div>
        );
      }
      return (
        <div className = 'commands'>
            <h3>Breakfast Club</h3>
            <Link to={"./Dashboard"}>
                <img src = {logo2} alt= 'breakfast club logo' id ='logobutton'/>
            </Link>
            <h4 class = 'usertracker'>{isRstrnt ? 'Restaurant' : 'User'} view </h4>


            <Link to={"./Dashboard"}>
                <Button>Dashboard</Button>
            </Link> <br/>

            <Link to={"./Profile"}>
                <Button>Profile</Button>
            </Link> <br/>

            <Link to={"./Events"}>
                <Button>Upcoming Events</Button>
            </Link> <br/>
            <Link to={"./"}  >
                <Button onClick={() => logout(app)}>Logout</Button>
            </Link> <br/>
        </div>
    );
    }
  }



  export default MainCommands;
