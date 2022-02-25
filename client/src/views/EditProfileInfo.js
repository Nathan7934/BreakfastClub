import React from 'react';
import Button from "@material-ui/core/Button";
import { getDefaultNormalizer } from '@testing-library/react';
import MainCommands from '../components/MainCommands';
import SearchBar from '../components/SearchBar';
import './EditProfileInfo.css'
import { Link } from "react-router-dom";
import { signUp, getUsers, updateUser } from "../actions/user";

class EditProfileInfo extends React.Component {
    constructor(props) {
        super(props);
        
        const to_edit = props.user;
        this.state = {
            userid: to_edit._id,
            username: to_edit.username,
            userBio: to_edit.profileInfo.bio,
            userLocation: to_edit.profileInfo.location,
            userKeywords: to_edit.profileInfo.keywords,
            keywordInput: ""
        }
    }

    processInput = (event) => {
        const value = event.target.value;
        const id = event.target.id;
        switch(id) {
            case 'inputBio':
                this.setState({userBio : value}); break;
            case 'inputLocation':
                this.setState({userLocation : value}); break;
            case 'inputKeywords':
                this.setState({keywordInput : value}); break;
        }
    }

    editProfile = (firstTime, user, app) => {
        user.profileInfo.bio = this.state.userBio
        user.profileInfo.location = this.state.userLocation
        user.profileInfo.keywords = this.state.userKeywords

        if(firstTime){
            signUp(user)
        }
        else{
            updateUser(user, app)
        }

        this.setState(
            {userid : 0,
            username: '',
            userBio: '',
            userLocation: '',
            userKeywords: [],
            keywordInput:''
        }
        )
    }

    addKeywords = () => {
        const keyword = this.state.keywordInput;
        if (keyword === '') { return; }
        this.setState({keywordInput: ""});

        const c_userKeywords = this.state.userKeywords;
        c_userKeywords.push(keyword);
        this.setState({userKeywords: c_userKeywords});
    }

    removeKeywords = (index) => {
        const c_userKeywords = this.state.userKeywords;
        c_userKeywords.splice(index, 1);
        this.setState({userKeywords: c_userKeywords});
    }
    

    renderKeywords = () => {
        const keywords = this.state.userKeywords;
        let keywords_list = [];
        for (let i = 0; i < keywords.length; i++) {
            keywords_list.push(<KeywordsItem keyword = {keywords[i]}  index = {i} removeKeywords = {this.removeKeywords}></KeywordsItem>);
        }
        return(<div id='keywordsList'>{keywords_list}</div>);
    }


    render(){
        const {app, user, appState, firstTime, SetSearchedUser} = this.props
        if (firstTime) {
            return(
                <div>
                    <div className='firstEdit'>
                        <h3 className='headerCenter'> Lets get you started {this.state.username}!</h3>
                        <div className='ProfileInput'>
                            <div className='InputContent'>
                                <h3 className='headerCenter'>Tell us about your self!</h3>
                                <p>Bio: <textarea id='inputBio' value={this.state.userBio} onChange={this.processInput} rows='text' placeholder='bio'/>
                                </p>
                                <p>Location: <input id='inputLocation' value={this.state.userLocation} onChange={this.processInput} type='text' placeholder='Location'/>
                                </p>
                                <h4 className = 'headerCenter'>Add Keywords about yourself <br/>to help us make your experience better!</h4>
                                <p>Keywords: <input id='inputKeywords' value={this.state.keywordInput} onChange={this.processInput} type='text' placeholder='Keywords'/>
                                <Button class='addKeywordsButton' onClick={this.addKeywords} tabIndex='-1'>Add</Button></p>
                                {this.renderKeywords()}
                                <Link to={"./"}>
                                    <Button class='editButton' onClick={() => {this.editProfile(firstTime, user, app)}} >Confirm</Button>
                                </Link>
                            </div>    
                        </div>
                    </div>       
                </div>
            )
        }
        else{
            return(
                <div>
                <MainCommands app ={app} isRstrnt={appState.sessionUser.isRstrnt} isAdmin ={appState.isAdmin}/>
                <SearchBar users={appState.users} SetSearchedUser = {SetSearchedUser} />
                    <div className='InputPage'>
                        <h3 className='headerCenter'> Edit Profile Information</h3>
                        <div className='ProfileInput'>
                            <Link to={"./Profile"}>
                                <Button class='exitButton'>Exit</Button>
                            </Link>
                            <div className='InputContent'>
                                
                                {/* Include ability to change user profile picture here in phase 2 */}
                                <h3 className='headerCenter'>Current {this.state.username}'s Profile Information</h3>
                                <p>Bio: <textarea id='inputBio' value={this.state.userBio} onChange={this.processInput} rows='text' placeholder='bio'/>
                                </p>
                                <p>Location: <input id='inputLocation' value={this.state.userLocation} onChange={this.processInput} type='text' placeholder='Location'/>
                                </p>
                                <p>Keywords: <input id='inputKeywords' value={this.state.keywordInput} onChange={this.processInput} type='text' placeholder='Keywords'/>
                                <Button class='addKeywordsButton' onClick={this.addKeywords} tabIndex='-1'>Add</Button></p>
                                {this.renderKeywords()}
                                <Link to={"./Profile"}>
                                    <Button class='editButton' onClick={() => {this.editProfile(firstTime, user, app)}} >Save</Button>
                                </Link>
                            </div>
                            
                        </div>
                    </div>
                        
                </div>
            )
        }
        
    }
}

class KeywordsItem extends React.Component {
    render() {
        const {keyword, index, removeKeywords} = this.props
        return(
            <span class='attendee'>
                <span class='attendeeName'>{keyword}</span> {/* TODO: Use a user tagging component here */}
                
                <button class='removeAttendee' onClick={() => {removeKeywords(index)}}>[x]</button>
            </span>
        );
    }
}

export default EditProfileInfo;