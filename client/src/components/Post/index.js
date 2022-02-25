import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import "./style.css";

class Post extends React.Component {

    state = {
      userfound: false,
      restaurantfound: false,

    }

    // keepPost = (event, id, reported) => {
    //   if (typeof reported !== 'undefined') {
    //     const newReport = reported
    //     const inReported = reported[1].filter((rpost) => rpost.id === id)
    //     if (inReported.length === 1) {
    //       const Rindex = reported[1].indexOf(inReported[0])
    //       console.log(Rindex)
    //       newReport[1].splice(Rindex, 1);
    //       this.props.SetReportedState(newReport)
    //       console.log(newReport)
    //     }

    //   }
    // }

    deletePost = (event, id, posts, reported) => {
      // this.keepPost(event, id, reported)
      const toDelete = posts.filter((post) => post.id === id)
      if (toDelete.length === 1) {
        const index = posts.indexOf(toDelete[0])
        posts.splice(index, 1);
      }
          }



    findProfileByUserName = (userName, users) => {
      const searchedUser = users.filter((user) => userName === user.username)
      this.setState({
        userfound : searchedUser.length === 1
      })
      this.props.SetSearchedUser(searchedUser[0], searchedUser.length === 1)


    }

    findProfileByName = (Name, users) => {
      const searchedUser = users.filter((user) => Name === user.name)
      this.setState({
        restaurantfound : searchedUser.length === 1
      })
      this.props.SetSearchedUser(searchedUser[0], searchedUser.length === 1)


    }

    // reportPost = ( reported, posts, postid) => {
    //   const FoundPost = posts.filter((post) => post.id === postid)[0]
    //   const ReportedPost = reported[1].filter((flagged) => FoundPost.id === flagged.id)
    //   // will only reported once into the array
    //   if (ReportedPost.length === 0) {
    //       let newReport = reported
    //       newReport[1].push(FoundPost)
    //       this.props.SetReportedState(newReport)
    //   }

    // }

    checkReported = (isAdmin, reported, posts, id) => {
      if (!isAdmin) {
        return;
        // const inReported = (reported[1].filter((flagged) => id === flagged.id).length === 1)
        // if (inReported) {
        //   return (
        //     <button className='reportPost' disabled> REPORTED!</button>
        //   )
        // }
        // return (
        //   <button className='reportPost' onClick={(event) => this.reportPost( reported, posts, id)}>!</button>
        // )
      }
      // show delete buttom everywhere for admin
      return (
        <><Link to={"./Dashboard"}>
            <button className='deletePost' onClick={(event) => this.deletePost(event, id, posts, reported)}>DELETE</button>
          </Link>
          {/* <button className='keepPost' onClick={(event) => this.keepPost(event, id, reported)}>KEEP</button> */}
        </>
      )

    }

    userLinked = (restaurant, users) => {
      const validRes = users.filter((user) => restaurant === user.Name)
      if (validRes.length === 1) {
        return(
          <Link
          onClick={() => this.findProfileByName(restaurant, users)} 
          to={"/SearchedUser"} 
          className="restaurantTag">
            {restaurant} 
            </Link>
        )
      }
      return (
        <>
          {restaurant}
        </>
      )
    }

    render() {
      const {id, userName, text, restaurant, image, ownedByUser, posts, users, reported, SetSearchedUser, SetReportedState, isAdmin} = this.props

      // show delete post button if on current user's profile
      if (ownedByUser) {
        return (
          <div className='post'>
            <Link to={"./Profile"}>
              <button className='deletePost' onClick={(event) => this.deletePost(event, id, posts)}>X</button>
            </Link>
            <div className="postContent">
              <h3><Link to={"./Profile"} className = {"username"}>@{userName}</Link></h3>
              <p>{text}</p>
              <p>
                {this.userLinked(restaurant, users)}&#128205;
              </p>
              <img src={ image } className="postContentPicture"/>
            </div>

       		</div>
        )
      } // otherwise don't show delete post button
      return (
        <div className='post'>
          {this.checkReported(isAdmin, reported, posts, id)}
          <div className="postContent">
            <h3 onClick={() => this.findProfileByUserName(userName, users)}><Link to={"./SearchedUser"} className = {"username"}>@{userName}</Link></h3>
            <p>{text}</p>
            {/* <p onMouseEnter={() => this.findProfileByName(restaurant, users)}>
              {this.userLinked(restaurant)}&#128205;
            </p> */}
            <p>
                {this.userLinked(restaurant, users)}&#128205;
            </p>
            <img src={ image } className="postContentPicture"/>
          </div>

     		</div>
      )

    }
}

export default Post;
