import React from 'react';
import Button from "@material-ui/core/Button";
import './CreateEvent.css'
import {getEvents, createEditEvent, deleteEvent} from './EventDB';

class CreateEvent extends React.Component {

    constructor(props) {
        super(props);
        if (props.mode === 'edit') {
            const to_edit = props.toEdit;
            this.state = {
                eventId: to_edit.id,
                eventName: to_edit.name,
                eventDesc: to_edit.desc,
                eventAttendees: to_edit.attendees,
                eventDate: to_edit.date,
                eventTime: to_edit.time,
                eventLocation: to_edit.location,
                attendeeField: "",
                eventsLength: -1 // Set to -1 until the length of the events collection is acquired
            }
        } else {
            this.state = {
                eventId: -1,
                eventName: "",
                eventDesc: "",
                eventAttendees: [],
                eventDate: "",
                eventTime: "",
                eventLocation: "",
                attendeeField: "",
                eventsLength: -1
            }
        }
    }

    loadData = async () => {
        const loaded_events = await getEvents();
        if (loaded_events) {
            this.setState({eventsLength: loaded_events.length});
        }
    }

    processInput = (event) => {
        const value = event.target.value;
        const id = event.target.id;
        switch(id) {
            case 'eName':
                this.setState({eventName : value}); break;
            case 'eDesc':
                this.setState({eventDesc : value}); break;
            case 'eDate':
                this.setState({eventDate : value}); break;
            case 'eTime':
                this.setState({eventTime : value}); break;
            case 'eLocation':
                this.setState({eventLocation : value}); break;
            case 'eAttendee':
                this.setState({attendeeField: value}); break;
        }
    }

    finalizeEvent = (mode) => {
        let new_id;
        if (mode === 'create') {new_id = this.state.eventsLength;}
        else {new_id = this.state.eventId;}
        const new_event = {
            id: new_id, owner: this.props.owner, name: this.state.eventName,
            desc: this.state.eventDesc, date: this.state.eventDate, time: this.state.eventTime,
            location: this.state.eventLocation, attendees: this.state.eventAttendees, isEditing: false
        };
        if (mode === 'create') {
            createEditEvent(new_event, 'create');
        } else {
            createEditEvent(new_event, 'edit');
        }
        this.setState({eventName: "", eventDesc: "", eventAttendees: [], eventDate: "", eventTime: "", eventLocation: ""});
    }

    removeEvent = () => { deleteEvent(this.state.eventId); }

    addAttendee = () => {
        const new_attendee = this.state.attendeeField;
        if (new_attendee === '') { return; }
        this.setState({attendeeField: ""});

        const curr_attendees = this.state.eventAttendees;
        curr_attendees.push(new_attendee);
        this.setState({eventAttendees: curr_attendees});
    }

    removeAttendee = (index) => {
        const curr_attendees = this.state.eventAttendees;
        curr_attendees.splice(index, 1);
        this.setState({eventAttendees: curr_attendees});
    }

    renderHeader = () => {
        if (this.props.mode === 'edit') {
            return(<h3>Editing Event...</h3>);
        }
        return(<h3>Create an Event</h3>);
    }

    renderAttendees = () => {
        const attendees = this.state.eventAttendees;
        let attendee_list = [];
        for (let i = 0; i < attendees.length; i++) {
            attendee_list.push(<AttendeeItem a_name={attendees[i]} a_index={i} removeAttendee={this.removeAttendee}></AttendeeItem>);
        }
        return(<div id='attendeeList'>{attendee_list}</div>);
    }

    renderActions = () => {
        const is_disabled = this.state.eventsLength === -1 ? true : false;
        if (this.props.mode === 'edit') {
            return(
                <><button class='removeButton' onClick={() => {this.removeEvent()}} tabIndex='-1' disabled={is_disabled}>Remove</button>
                <button class='editButton' onClick={() => {this.finalizeEvent('edit')}} tabIndex='-1' disabled={is_disabled}>Edit</button></>
            );
        }
        return(<button class='createButton' onClick={() => {this.finalizeEvent('create')}} tabIndex='-1' disabled={is_disabled}>Create</button>);
    }

    render() {
        this.loadData();
        return (
            <div id='createEvent'>
                {this.renderHeader()}
                <input id='eName' value={this.state.eventName} onChange={this.processInput} type='text' placeholder='Name'/>
                <br/>
                <textarea id='eDesc' value={this.state.eventDesc} onChange={this.processInput} rows='5' placeholder='Description'/>
                <br/>
                <div id='dateTimeLocation'>
                    <input id='eDate' value={this.state.eventDate} onChange={this.processInput} type='text' placeholder='Date (YYYY-MM-DD)'/>
                    <input id='eTime' value={this.state.eventTime} onChange={this.processInput} type='text' placeholder='Time (00:00am/pm)'/>
                    <input id='eLocation' value={this.state.eventLocation} onChange={this.processInput} type='text' placeholder='Location'/>
                </div>
                <input id='eAttendee' value={this.state.attendeeField} onChange={this.processInput} type='text' placeholder='New attendee'/>
                <Button class='eAttendeeAdd' onClick={this.addAttendee} tabIndex='-1'>Add</Button>
                <br/><br/><br/><br/><br/><br/>
                {this.renderAttendees()}
                {this.renderActions()}
            </div>
        );
    }
}

class AttendeeItem extends React.Component {
    render() {
        const a_name = this.props.a_name;
        const a_index = this.props.a_index;
        const removeAttendee = this.props.removeAttendee;
        return(
            <span class='attendee'>
                <span class='attendeeName'>{a_name}</span> {/* TODO: Use a user tagging component here */}
                <button class='removeAttendee' onClick={() => {removeAttendee(a_index)}}>[x]</button>
            </span>
        );
    }
}

export default CreateEvent;
