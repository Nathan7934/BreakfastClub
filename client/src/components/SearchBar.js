import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import '../index.css'

  class SearchBar extends React.Component {
      state = {
        searchedUser: {
          _id: '',
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
        },
        username: "",
        success: false
      }


      setUserInSearch = (user) => {
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
      handleInputChange = (event, users) => {
        const value = event.target.value
        const searchedUser = users.filter((user) => value === user.username)
        if (searchedUser.length === 1) {
          this.setState({
            username: value,
            success: true
          })

          // this.setUserInSearch(searchedUser[0])

        } else {
          this.setState({
            username: value,
            success: false
          })
        }
      }

      searchUser = (event, users) => {
        if (this.state.success) {
          const searchedUser = users.filter((user) => this.state.username === user.username)
          this.setUserInSearch(searchedUser[0])
        }
        this.props.SetSearchedUser(this.state.searchedUser, this.state.success)
      }

      render() {
        const {users, SetSearchedUser} = this.props

        return (
          <form id="search" >
         		<input
              value={this.state.username}
              onChange={(event) => this.handleInputChange(event, users)}
              id="searchedUser"
              type="text"
              placeholder="User, Restaurant, Keywords"
            />

            <Link to ={this.state.success ? "./SearchedUser" : "./UserNotFound"}>
           		<input
                type="submit"
                value="Search"
                onClick={(event) =>  this.searchUser(event, users)}
              />
            </Link>
          </form>
        )
      }
  }

  export default SearchBar;
