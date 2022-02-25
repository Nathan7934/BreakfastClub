import React, { useState } from 'react';
import MainCommands from '../components/MainCommands';
import SearchBar from './../components/SearchBar';
import Button from "@material-ui/core/Button";
import './NewPost.css';
import Axios from 'axios'
import { file } from '@babel/types';


class NewPost extends React.Component {

    state = {
      text: "",
      image: null,
      imageURL: "",
      restaurantTag: "",
      isCollapsed: true
    }
    SetCollapsed = (_isCollapsed) => { this.setState({isCollapsed: _isCollapsed}) }

    handleInputChange = (event) => {
        const value = event.target.value;
        const id = event.target.id;
        switch(id) {
            case 'postText':
                this.setState({text : value}); break;
            case 'chooseFile':
                this.setState({image : event.target.files[0]}); break;

            case 'postRestaurant':
                this.setState({restaurantTag : value}); break;
        }
    }

    // setImageSelected = (event) => {
    //   const imageselected = event.target.files[0];
    //   this.setState({image : imageselected});
    //   console.log(this.state[image])
    // }

    upLoadImage = async e => {
      const formData = new FormData()
      formData.append("file", this.state.image)
      formData.append("upload_preset", "tsengpor")

      // Axios.post(
      //   "https://api.cloudinary.com/v1_1/dtcpnk7py/image/upload",
      //   formData
      //   ).then((result) => {
      //   console.log(result);
      // });
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dtcpnk7py/image/upload',
        {
          method: "POST",
          body: formData
        }
      )
      const file = await res.json()
      this.setState({imageURL : file.secure_url});
    }


    createPost = (event, posts) => {
        let newPosts = posts
        const newPost = {
          id: newPosts[newPosts.length-1].id+1,
          userName: this.props.currentUser.username,
          text: this.state.text,
          restaurant: this.state.restaurantTag,
          image: this.state.imageURL
        }
        newPosts.push(newPost)
        this.props.SetPostsState(newPosts)
    }

    render() {
        const {posts, SetPostsState, currentUser} = this.props
        if(this.state.isCollapsed){
          return (
            <div id ='newPostCollapsed'>
              <h3 id = 'collapsedPrompt'>What are you craving to post today? <span><button onClick={() => this.SetCollapsed(false)} class='expandButton'>Create Post</button></span></h3>
            </div>
          );
        }
        else if(!this.state.isCollapsed){
          return(
            <div id='newPost'>
              <span><button onClick={() => this.SetCollapsed(true)} class='collapseButton'>X</button></span>
              <h3>New Post</h3>
              <textarea
                id='postText'
                rows='5'
                placeholder='Text'
                value={this.state.text}
                onChange={this.handleInputChange}
              />
              <br/>
              <div id='image'>
                <input
                  id='chooseFile'
                  type="file"
                  onChange={this.handleInputChange}
                />
                <button
                  id='UpLoad'
                  onClick={this.upLoadImage}> Upload Image </button>
              </div>
              <br/>
              <input
                id='postRestaurant'
                type='text'
                placeholder='Restaurant Tag'
                value={this.state.restaurantTag}
                onChange={this.handleInputChange}
              />
              <br/>
              <Button class='postButton' onClick={(event) => this.createPost(event, posts)}>Post</Button>
            </div>
          )

        }
    }
}

export default NewPost;
