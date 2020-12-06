import React, { Component, Fragment } from "react";
import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";
import URL from "../../baseURL";
import PostUser from "../../components/Feed/Post/Postuser";

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: "",
    postPage: 1,
    DraggedItem: null,
    postsLoading: true,
    editLoading: false,
  };

  componentDidMount() {
    fetch(URL + "/auth/user")
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch user status.");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({ status: resData.status });
      })
      .catch(this.catchError);

    this.loadPosts();
  }

  loadPosts = (direction) => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === "next") {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === "previous") {
      page--;
      this.setState({ postPage: page });
    }
    fetch(URL + "/notification/?page=" + page, {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch posts.");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({
          posts: resData.posts.map((post) => {
            return {
              ...post,
            };
          }),
          totalPosts: resData.totalItems,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    this.setState((prevState) => {
      console.log("post id" + postId);
      const loadedPost = { ...prevState.posts.find((p) => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = (postData) => {
    this.setState({
      editLoading: true,
    });
    let url = URL + "/notification/post";
    let method = "POST";
    if (this.state.editPost) {
      url = URL + "/notification/post/" + this.state.editPost._id;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        content: postData.content,
        title: postData.title,
        url: postData.url,
      }),
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating or editing a post failed!");
        }
        return res.json();
      })
      .catch((err) => {
        throw new Error("You not a developer");
      })
      .then((resData) => {
        console.log(resData);
        const post = {
          _id: resData.post._id,
          title: resData.post.title,
          content: resData.post.content,
          read: resData.post.read,
        };
        this.setState((prevState) => {
          let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              (p) => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          } else if (prevState.posts.length < 2) {
            updatedPosts = prevState.posts.concat(post);
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
          };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = (postId) => {
    this.setState({ postsLoading: true });
    fetch(URL + "/notification/post/" + postId, {
      method: "DELETE",
      body: JSON.stringify({ userId: localStorage.getItem("userId") }),
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Deleting a post failed!");
        }
        return res.json();
      })
      .catch((err) => {
        throw new Error("You not a developer");
      })
      .then((resData) => {
        console.log(resData);
        this.setState((prevState) => {
          const updatedPosts = prevState.posts.filter((p) => p._id !== postId);
          return { posts: updatedPosts, postsLoading: false };
        });
      })
      .catch((err) => {
        this.setState({ postsLoading: false });
        throw new Error("You not a developer");
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        {localStorage.getItem("role") === "Developer" ? (
          <section className="feed">
            <section className="feed__control">
              <Button
                mode="raised"
                design="accent"
                onClick={this.newPostHandler}
              >
                New Post
              </Button>
            </section>
            {this.state.postsLoading && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Loader />
              </div>
            )}

            {this.state.posts.length <= 0 && !this.state.postsLoading ? (
              <p style={{ textAlign: "center" }}>No posts found.</p>
            ) : null}
            {!this.state.postsLoading && (
              <Paginator
                onPrevious={this.loadPosts.bind(this, "previous")}
                onNext={this.loadPosts.bind(this, "next")}
                lastPage={Math.ceil(this.state.totalPosts / 2)}
                currentPage={this.state.postPage}
              >
                <Post
                  onStartEdit={this.startEditPostHandler.bind(this)}
                  onDelete={this.deletePostHandler.bind(this)}
                  list={this.state.posts}
                />
              </Paginator>
            )}
          </section>
        ) : (
          <section className="feed">
            {this.state.postsLoading && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Loader />
              </div>
            )}

            {this.state.posts.length <= 0 && !this.state.postsLoading ? (
              <p style={{ textAlign: "center" }}>No posts found.</p>
            ) : null}
            {!this.state.postsLoading && (
              <Paginator
                onPrevious={this.loadPosts.bind(this, "previous")}
                onNext={this.loadPosts.bind(this, "next")}
                lastPage={Math.ceil(this.state.totalPosts / 2)}
                currentPage={this.state.postPage}
              >
                <PostUser list={this.state.posts} />
              </Paginator>
            )}
          </section>
        )}
      </Fragment>
    );
  }
}

export default Feed;
