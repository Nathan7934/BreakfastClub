import React from 'react';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import MainCommands from '../../components/MainCommands';
import SearchBar from '../../components/SearchBar';
import CreateEvent from './CreateEvent';
import './Events.css';
import {getEvents, createEditEvent, deleteEvent} from './EventDB';

class EventPosts extends React.Component {
    // If <this.props.user> is a restaurant, it will display all events that they own. If the user is not a restaurant,
    // then it will display all events that they are attending.

    constructor(props) {
        super(props);
        this.state = {events: []};
    }

    loadData = async () => {
        const loaded_events = await getEvents();
        if (loaded_events) {
            this.setState({events: loaded_events});
        }
    }

    render() {
        const {appState, user, SetSearchedUser} = this.props;
        this.loadData();
        const events = this.state.events;
        let eventItems = [];
        for (var i = 0; i < events.length; i++) {
            if ((user.isRstrnt && user.username === events[i].owner) || (!user.isRstrnt && events[i].attendees.includes(user.username))) {
                if (events[i].isEditing && (appState.sessionUser.username === events[i].owner || appState.sessionUser.isAdmin)) {
                    eventItems.push(<CreateEvent owner={events[i].owner} mode='edit' toEdit={events[i]}/>)
                } else {
                    eventItems.push(<EventItem appState={appState} event={events[i]} content={true} SetSearchedUser={SetSearchedUser}/>); 
                }
            }
        }
        if (eventItems.length === 0) {
            eventItems.push(<EventItem content={false} SetSearchedUser={SetSearchedUser} />)
        }
        return (<div class='EventPosts'>{eventItems}</div>);
    }
}

class EventItem extends React.Component {
    signUp = () => {
        let to_attend = this.props.event;
        const curr_user = this.props.appState.sessionUser;

        to_attend.attendees.push(curr_user.username);
        createEditEvent(to_attend, 'edit');
    }

    cancelAttendance = () => {
        let to_cancel = this.props.event;
        const curr_user = this.props.appState.sessionUser;

        const remove_index = to_cancel.attendees.indexOf(curr_user.username);
        to_cancel.attendees.splice(remove_index, 1);
        createEditEvent(to_cancel, 'edit');
    }

    editEvent = () => {
        let to_edit = this.props.event;
        to_edit.isEditing = true;
        createEditEvent(to_edit, 'edit');
    }

    // find profile of given username, and that user as the searched user
    findProfileByUserName = (userName, users) => {
    //   console.log(userName)
      const searchedUser = users.filter((user) => userName === user.username)

    //   console.log(searchedUser)
      this.props.SetSearchedUser(searchedUser[0], searchedUser.length === 1)
    }

    // add user link functionality to attendee
    addLinkToAttendee = (attendeeList, username, lastAttendee) => {
      const validUser = this.props.appState.users.filter((user) => username === user.username)
      if (lastAttendee) {
        if (validUser.length === 1) {
          attendeeList.push(
              <Link class='attendeeItem'
                onClick={() => this.findProfileByUserName(username, this.props.appState.users)}
                to={"./SearchedUser"}
                className='LinkStyle'>
                @{username}
              </Link>)
        } else {
          attendeeList.push(<span class='attendeeItem'>@{username}</span>)
        }
      } else {
        if (validUser.length === 1) {
          attendeeList.push(
              <Link class='attendeeItem'
                onClick={() => this.findProfileByUserName(username, this.props.appState.users)}
                to={"./SearchedUser"}
                className='LinkStyle'>
                <span>@{username}, </span>
              </Link>)
        } else {
          attendeeList.push(<span class='attendeeItem'>@{username}, </span>)
        }
      }
    }

    renderAttendeeList = (attendees) => {
        var attendeeList = [];
        for (var i = 0; i < attendees.length; i++) {
            if (i === attendees.length - 1) {
                this.addLinkToAttendee(attendeeList, attendees[i], true)
                // attendeeList.push(<span class='attendeeItem'>@{attendees[i]}</span>);
            } else {
                this.addLinkToAttendee(attendeeList, attendees[i], false)
                // attendeeList.push(<span class='attendeeItem'>@{attendees[i]}, </span>);
            }
        }
        return (<span class='eventAttendees'><i>Attendees</i>: {attendeeList}</span>);
    }

    renderAction = () => {
        const event = this.props.event;
        // const orginaluser = this.props.appState.searchedUser.UserName
        const currUser = this.props.appState.sessionUser;
        const isAdmin = currUser.isAdmin;
        if (currUser.username === event.owner || isAdmin) {
            return(<Button 
                        class='actionButton'  
                        // onMouseEnter={() => this.findProfileByUserName(orginaluser, this.props.appState.users)} 
                        onClick={() => {this.editEvent()}} 
                        tabIndex='-1'>
                    Edit
                    </Button>);
        }
        else if (!currUser.isRstrnt && !event.attendees.includes(currUser.username)) {
            return(<Button 
                        class='actionButton'  
                        // onMouseEnter={() => this.findProfileByUserName(orginaluser, this.props.appState.users)} 
                        onClick={() => {this.signUp()}} 
                        tabIndex='-1'>
                            Sign Up
                    </Button>);
        }
        else if (event.attendees.includes(currUser.username)) {
            return(<Button 
                        class='actionButton'  
                        // onMouseEnter={() => this.findProfileByUserName(orginaluser, this.props.appState.users)} 
                        onClick={() => {this.cancelAttendance()}} 
                        tabIndex='-1'>Cancel Attendance</Button>
            );
        }
        return(<></>);
    }

    render() {
        if (this.props.content === false) {
            return(<div class='noEvent'>There are no events to display</div>);
        }
        const event = this.props.event;
        return (
            <div class='eventContent'>
                <h3 class='eventName'>{event.name}</h3>
                  <span class='eventOwner'><span>Host: </span>
                      <Link onClick={() => this.findProfileByUserName(event.owner, this.props.appState.users)} to={"./SearchedUser"} className='LinkStyle'>
                        @{event.owner}
                      </Link>
                  </span> {/* User tagging system should be implemented here for owner */}
                <p>{this.renderAttendeeList(event.attendees)}</p>
                <p class='eventDesc'>{event.desc}</p>

                <p>{event.date}, {event.time} <br/> {event.location} </p>
                {this.renderAction()}
            </div>
        );
    }
}

export default EventPosts;
