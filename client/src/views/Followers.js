import React from 'react';
import { Link } from 'react-router-dom';
import MainCommands from '../components/MainCommands';
import SearchBar from './../components/SearchBar';
import Button from "@material-ui/core/Button";
import './Follow.css'
import { addFollowing, deleteFollowing} from "../actions/follow";
class Followers extends React.Component {

    state = {
        userfound: false,
        currUserFollowing: this.props.currentUser.following,
        currUserResFollowing: this.props.currentUser.resfollowing
    }

    get getFollowing() {
        const following =  (this.props.appState.isFollowTargetRes) ? this.state.currUserResFollowing : this.state.currUserFollowing
        return following
    }

    findProfileByUserName = (userName, users) => {
        const searchedUser = users.filter((user) => userName === user.username)
        this.setState({
          userfound : searchedUser.length === 1
        })
        this.props.SetSearchedUser(searchedUser[0], searchedUser.length === 1)

      }

    SetCurrUserFollowing = (_currUserFollowing) => { this.setState({currUserFollowing: _currUserFollowing}) }
    SetCurrUserResFollowing = (_currUserResFollowing) => { this.setState({currUserResFollowing: _currUserResFollowing}) }
    
    

    // handleDeleteFollowing = (username, isRes) => {
    //     if (isRes) {
    //         const updatedResfollowing = this.props.currentUser.resfollowing
    //         var index = updatedResfollowing.indexOf(username)
    //         if (index !== -1) {
    //             updatedResfollowing.splice(index, 1);
    //         }
    //         const updatedCurrUser = {
    //             Name: this.props.currentUser.Name,
    //             UserName: this.props.currentUser.UserName, 
    //             Password: this.props.currentUser.Password, 
    //             sRstrnt: this.props.currentUser.sRstrnt, 
    //             following: this.props.currentUser.following, 
    //             followers: this.props.currentUser.followers, 
    //             resfollowing: updatedResfollowing,
    //             resfollower: this.props.currentUser.resfollower
    //         }
    //         this.props.SetCurrentUser(updatedCurrUser)
    //         this.SetCurrUserResFollowing(updatedResfollowing)
    //         // this.SetUser(updatedCurrUser)
    //     } else {
    //         const updatedfollowing = this.props.currentUser.following
    //         var index = updatedfollowing.indexOf(username)
    //         if (index !== -1) {
    //             updatedfollowing.splice(index, 1);
    //         }
    //         const updatedCurrUser = {
    //             Name: this.props.currentUser.Name,
    //             UserName: this.props.currentUser.UserName, 
    //             Password: this.props.currentUser.Password, 
    //             sRstrnt: this.props.currentUser.sRstrnt, 
    //             following: updatedfollowing, 
    //             followers: this.props.currentUser.followers, 
    //             resfollowing: this.props.currentUser.resfollowing,
    //             resfollower: this.props.currentUser.resfollower
    //         }
    //         this.props.SetCurrentUser(updatedCurrUser)
    //         this.SetCurrUserFollowing(updatedfollowing)
    //         // this.SetUser(updatedCurrUser)
    //     }
    //     console.log(this.state.currUserResFollowing, "currResFollowing after")
    //     console.log(this.state.currUserFollowing, "currFollowing after")
    // }


    // handleInsertFollowing = (username, isRes) => {
    //     if (isRes) {
    //         const updatedResfollowing = this.props.currentUser.resfollowing
    //         updatedResfollowing.push(username)
    //         const updatedCurrUser = {
    //             Name: this.props.currentUser.Name,
    //             UserName: this.props.currentUser.UserName, 
    //             Password: this.props.currentUser.Password, 
    //             sRstrnt: this.props.currentUser.sRstrnt, 
    //             following: this.props.currentUser.following, 
    //             followers: this.props.currentUser.followers, 
    //             resfollowing: updatedResfollowing,
    //             resfollower: this.props.currentUser.resfollower
    //         }
    //         this.props.SetCurrentUser(updatedCurrUser)
    //         this.SetCurrUserResFollowing(updatedResfollowing)
    //     } else {
    //         const updatedfollowing = this.props.currentUser.following
    //         updatedfollowing.push(username)
    //         const updatedCurrUser = {
    //             Name: this.props.currentUser.Name,
    //             UserName: this.props.currentUser.UserName, 
    //             Password: this.props.currentUser.Password, 
    //             sRstrnt: this.props.currentUser.sRstrnt, 
    //             following: updatedfollowing, 
    //             followers: this.props.currentUser.followers, 
    //             resfollowing: this.props.currentUser.resfollowing,
    //             resfollower: this.props.currentUser.resfollower
    //         }
    //         this.props.SetCurrentUser(updatedCurrUser)
    //         this.SetCurrUserFollowing(updatedfollowing)
    //     }
    //     console.log(this.state.currUserResFollowing, "currResFollowing after")
    //     console.log(this.state.currUserFollowing, "currFollowing after")
    // }

    render() {
        const {app, isRstrnt, isAdmin, users, SetSearchedUser, currentUser, appState, searchedUser, SetCurrentUser} = this.props;
        const isRestaurantFollow = appState.isFollowTargetRes
        const user = (currentUser.username === searchedUser.username) ? currentUser : searchedUser
        const follower = (isRestaurantFollow) ? user.resfollowers : user.followers
        return (
            <div>
                <MainCommands app ={app} isRstrnt={isRstrnt} isAdmin ={isAdmin}/>
                <SearchBar users={users} SetSearchedUser = {SetSearchedUser}/>
                <div className = 'Follow'>
                    <h1> Followers </h1>
                    <ul>
                        {follower.map((followUsr) => {

                            return (
                                <li>
                                    <div className='element'>
                                        <div onClick={() => this.findProfileByUserName(followUsr.username, users)}>
                                        <Link to={"./SearchedUser"} className = {"username"}>@{followUsr.username}</Link></div>
                                    </div>
                                    <div>
                                        <button 
                                            onClick={() =>  { (this.getFollowing.filter(e => e.username === followUsr.username).length > 0) ? 
                                                deleteFollowing(isRestaurantFollow, app, currentUser.username, followUsr.username, this) : 
                                                addFollowing(isRestaurantFollow, app, currentUser._id, followUsr.name, followUsr.username, this)
                                            }}
                                            className='FollowButton'> {(this.getFollowing.filter(e => e.username === followUsr.username).length > 0) ? 'unfollow' : 'follow' }</button>
                                    </div>
                                </li>
                            )
                        }
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Followers;
