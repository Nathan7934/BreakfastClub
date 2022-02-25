import React from 'react';
import MainCommands from '../../components/MainCommands';
import SearchBar from '../../components/SearchBar';
import './Events.css';
import EventPosts from './EventPosts'
import CreateEvent from './CreateEvent';

class Events extends React.Component {
    state ={
        isCollapsed: true
    }
    SetCollapsed = (_isCollapsed) => { this.setState({isCollapsed: _isCollapsed}) }
    renderCreateEvent = () => {
        const appState = this.props.app.state;
        if (appState.sessionUser.isRstrnt) {
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
                    <button onClick={() => this.SetCollapsed(true)} class='collapseEButton'>Exit</button>
                    <CreateEvent
                        owner={appState.sessionUser.username}
                        mode='create'
                    />
                    </>
                );
            }
            
            /* Make sure that we pass the list of ALL events in the final build, which is what we're doing now, but the events
            state will eventually be changed to reflect only the current user's events */
        }
        return(<></>);
    }

    render() {
        const {app, SetSearchedUser} = this.props;
        return(
            <>
                <MainCommands app={app} isRstrnt={app.state.sessionUser.isRstrnt} isAdmin ={app.state.sessionUser.isAdmin}/>
                <SearchBar users={app.state.users} SetSearchedUser = {SetSearchedUser} />
                <div className ='Structure'>
                    <h2 className ='header'> Upcoming Events</h2>
                    {this.renderCreateEvent()}
                    <EventPosts appState={app.state} user={app.state.sessionUser} SetSearchedUser={SetSearchedUser}/>
                </div>
            </>
        );
    }
}

export default Events;
