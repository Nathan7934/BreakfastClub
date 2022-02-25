import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Post from './../Post/index';
import "./style.css"
import NewPost from "./../../views/NewPost"
import banner from './../../views/breakfastclubentry.png'

class DashboardTimeline extends React.Component {
    state = {
      explore: false
    }

    SetExplore = (__explore) => { this.setState({explore: __explore}) }

    render() {
      const {posts, users, reported, SetSearchedUser, SetPostsState, SetReportedState, currentUser, isAdmin} = this.props
      let dashboardPosts = null

      const newsfeed = currentUser.following
      if(!this.state.explore){
        newsfeed.push(currentUser.username)
        dashboardPosts = posts.filter((post) => newsfeed.includes(post.userName))
        newsfeed.pop()

      }
      else{
        dashboardPosts = posts

      }
      
      const exploreB = (this.state.explore) ?  'Back to News Feed' : 'Explore' 

      return (
        <div className="timeline">
          <img src = {banner} alt= 'breakfast club banner' id ='bannerpic'/>
          <h3 className = "centered" >Welcome, {currentUser.name}! 
          <div class = "buttons">
            <Button onClick={() => this.SetExplore(!this.state.explore)} id = 'exploreButton'>{exploreB}</Button>
          </div>
          </h3>
          <NewPost posts={posts} SetPostsState={SetPostsState} currentUser={currentUser}/>
          {dashboardPosts.slice(0).reverse().map((post) =>
            <Post
            id={post.id}
            userName={post.userName}
            text={post.text}
            restaurant={post.restaurant}
            image={post.image}
            ownedByUser={post.userName === currentUser.username}
            posts={posts}
            users={users}
            reported = {reported}
            SetSearchedUser={SetSearchedUser}
            SetReportedState={SetReportedState}
            isAdmin = {isAdmin}
            />
          )}
        </div>
      )
    };
}



export default DashboardTimeline;
