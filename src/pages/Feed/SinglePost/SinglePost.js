import React, { Component } from 'react';
import URL from '../../../baseURL';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    content: '',
    url: '',
    read: false
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    fetch(URL + '/notification/post/' + postId, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          title: resData.post.title,
          content: resData.post.content,
          url: resData.post.url,
          read: resData.post.read
        });

      })
      .catch(err => {
        console.log(err);
      });

    if (!this.state.read) {
      fetch(URL + '/notification/markRead/' + postId, {
        method: 'PUT',
        body: JSON.stringify({
          "userId": localStorage.getItem('userId')
        }),
        headers: {
          Authorization: 'Bearer ' + this.props.token,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Deleting a post failed!');
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData);
          this.setState({
            title: resData.post.title,
            content: resData.post.content,
            url: resData.post.url,
            read: resData.post.read
          }
          );
        })
        .catch(err => {
          console.log(err);

        });
    }
  };



  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <p>{this.state.content}</p>
        <a href={'https://'+this.state.url}>Visit the Page</a>
        <br></br>
        <br></br>
      </section>
    );
  }
}


export default SinglePost;
