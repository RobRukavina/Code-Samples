import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import _logger from "sabio-debug";
import { getBlogById } from "../../services/blogService";
import toast from "toastr";
import CommentsByEntity from "../comments/CommentsByEntity";
import CommentForm from "../comments/CommentForm";
import { Modal, Container, Button } from "react-bootstrap";
import BlogForm from "../Blogs/BlogForm";
import { NavLink } from "react-router-dom";
import FileUpload from "../files/FileUpload";
import "./blogsCss/blogs.css";

class ABlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blog: {
        id: "",
        blogTypeId: "",
        author: "",
        title: "",
        subject: "",
        content: "",
        imageUrl: "",
        datePublish: "",
      },
      editBlogShow: false,
      commentFormShow: false,
      hasError: false,
      isLoading: true,
      commentUpdate: false,
      commentCount: 0,
    };
  }
  componentDidMount = () => {
    const id = this.props.match.params.id;
    if (id) {
      const { state } = this.props.location;
      if (state) {
        this.setBlog(state);
      } else {
        this.getById();
      }
    }
    _logger("componentDidMount", this.props.location.state);
  };

  setBlog = (blog) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        blog,
        showModal: false,
        isLoading: false,
      };
    });
  };

  getById = () => {
    if (this.props.match.params.id) {
      getBlogById(this.props.match.params.id)
        .then(this.getByIdSuccess)
        .catch(this.getByIdError);
    }
  };

  getByIdSuccess = (response) => {
    _logger("getByIdSuccess", response);
    this.setBlog(response.item);
  };

  getByIdError = (error) => {
    _logger("getByIdError", error);
    toast.error("Error", error);
    this.setState((prevState) => {
      return {
        ...prevState,
        showModal: false,
        hasError: true,
        isLoading: false,
      };
    });
  };

  uploadedFiles = (uploadedFiles) => {
    _logger("Returned Ids: ", uploadedFiles);

    this.setState(() => {
      return { currentImages: uploadedFiles };
    });
  };

  isAdminOrVendor = () => {
    let result = false;
    if (this.props.currentUser.roles.includes("Admin")) {
      result = true;
    } else if (this.props.currentUser.roles.includes("Vendor")) {
      result = true;
    } else {
      result = false;
    }
    return result;
  };

  handleEditBlogShow = () => {
    this.setState({ editBlogShow: !this.state.editBlogShow });
  };

  handleCommentFormShow = () => {
    this.setState({ commentFormShow: !this.state.commentFormShow });
  };

  updateCommentList = (bool) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        commentUpdate: bool,
      };
    });
  };

  commentCount = (int) => {
    _logger("Comment count: " + int);

    this.setState((prevState) => {
      return { ...prevState, commentCount: int };
    });
  };

  render() {
    if (
      this.isAdminOrVendor() === true &&
      this.state.hasError === false &&
      this.state.isLoading === false
    ) {
      let onEdit;

      onEdit = (
        <Button
          className="btn btn-primary"
          variant="primary"
          type="button"
          onClick={this.handleEditBlogShow}
        >
          Edit
        </Button>
      );
      if (this.state.blog) {
        if (this.state.blog.id) {
          return (
            <React.Fragment>
              <div className="page-body">
                <div className="col-sm-12">
                  <div className="blog-single">
                    <div className="blog-box blog-details">
                      <div className="ABlogImageContainer">
                        <img
                          src={this.state.blog.imageUrl}
                          alt=""
                          className="ABlogImage"
                        />
                      </div>
                      <div className="blog-details">
                        <ul className="blog-social">
                          <li className="digits">
                            {moment(this.state.blog.datePublish).format(
                              "MM/DD/YYYY"
                            )}
                          </li>
                          <li>
                            <i className="icofont icofont-user" />
                            {this.state.blog.author.firstName}{" "}
                            <span>{this.state.blog.author.lastName}, </span>
                            Contact By Email: {this.state.blog.author.email}
                          </li>
                          <li className="digits">
                            <i className="icofont icofont-thumbs-up" />
                            02<span>Hits</span>
                          </li>
                          <li className="digits">
                            <i className="icofont icofont-ui-chat" />
                            {this.state.commentCount} Comments
                          </li>
                        </ul>
                        <h2>{this.state.blog.title}</h2>
                        <h4>{this.state.blog.subject}</h4>
                        <div>{onEdit}</div>
                        <div className="single-blog-content-top">
                          <p>{this.state.blog.content}</p>
                        </div>
                        <div className="text-center mt-5">
                          <Button
                            size="lg"
                            onClick={this.handleCommentFormShow}
                          >
                            Add a comment!
                          </Button>
                        </div>
                        <section className="comment-box row">
                          <CommentsByEntity
                            entityId={this.state.blog.id}
                            entityTypeId={this.state.blog.blogTypeId}
                            props={this.props}
                            currentUser={this.props.currentUser}
                            update={this.state.commentUpdate}
                            updateFunc={this.updateCommentList}
                            commentCount={this.commentCount}
                            fromBlog={true}
                          />
                          {this.isAdminOrVendor() && (
                            <Modal
                              size="lg"
                              show={this.state.commentFormShow}
                              onHide={this.handleCommentFormShow}
                            >
                              <Modal.Body>
                                <CommentForm
                                  commentPlace={"Type your comment here."}
                                  subjectPlace={
                                    "Type the subject of your comment here."
                                  }
                                  cardTitle={"Comment"}
                                  cardSummary={
                                    "Let the author know what you think!"
                                  }
                                  entityId={this.state.blog.id}
                                  entityTypeId={this.state.blog.blogTypeId}
                                  currentUser={this.props.currentUser}
                                  {...this.props}
                                  closeCommentForm={this.handleCommentFormShow}
                                  update={this.updateCommentList}
                                ></CommentForm>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={this.handleCommentFormShow}
                                >
                                  Cancel
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          )}
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
                <Container>
                  <Modal
                    centered={true}
                    size="lg"
                    show={this.state.editBlogShow}
                    onHide={this.handleEditBlogShow}
                  >
                    <div className="container-inline fluid">
                      <div
                        className="row"
                        style={{
                          flexDirection: "row-reverse",
                          paddingRight: "20px",
                          paddingTop: "5px",
                        }}
                      >
                        <button
                          className="btn-sm btn-danger"
                          type="button"
                          color="red"
                          onClick={this.handleEditBlogShow}
                        >
                          x
                        </button>
                      </div>
                      <h2 style={{ textAlign: "center" }}>
                        Create or Edit Your Blog
                      </h2>
                    </div>
                    <div className="container inline col-xl-12 set-col-12">
                      <Button href="/blogs/admin">See All Blogs</Button>
                      <div style={{ float: "right" }}></div>
                    </div>
                    <h6>Upload Your Image Here</h6>
                    <div className="row">
                      <div className="col BlogsFileUpload">
                        <FileUpload
                          isMultipleEnabled={false}
                          onUploadComplete={this.uploadedFiles}
                          isPreviewEnabled={true}
                        />
                      </div>
                    </div>
                    <BlogForm
                      currentImages={this.state.currentImages}
                      getById={this.getById}
                      blog={this.state.blog}
                      onEdit={this.handleOpenModal}
                      closeModal={this.handleEditBlogShow}
                      showModal={this.state.editBlogShow}
                      {...this.props}
                    />
                  </Modal>
                </Container>
              </div>
            </React.Fragment>
          );
        }
      }
    } else if (
      this.isAdminOrVendor() !== true &&
      this.state.hasError === false &&
      this.state.isLoading === false
    ) {
      if (this.state.blog.id) {
        return (
          <React.Fragment>
            <div className="page-body">
              <div className="col-sm-12">
                <div className="blog-single">
                  <div className="blog-box blog-details">
                    <div className="ABlogImageContainer">
                      <img
                        src={this.state.blog.imageUrl}
                        alt=""
                        className="ABlogImage"
                      />
                    </div>
                    <div className="blog-details">
                      <ul className="blog-social">
                        <li className="digits">
                          {moment(this.state.blog.datePublish).format(
                            "MM/DD/YYYY"
                          )}
                        </li>
                        <li>
                          <i className="icofont icofont-user" />
                          {this.state.blog.author.firstName}{" "}
                          <span>{this.state.blog.author.lastName}, </span>
                          Contact By Email: {this.state.blog.author.email}
                        </li>
                        <li className="digits">
                          <i className="icofont icofont-thumbs-up" />
                          02<span>Hits</span>
                        </li>
                        <li className="digits">
                          <i className="icofont icofont-ui-chat" />
                          598 Comments
                        </li>
                      </ul>
                      <h2>{this.state.blog.title}</h2>
                      <h4>{this.state.blog.subject}</h4>
                      <div className="single-blog-content-top">
                        <p>{this.state.blog.content}</p>
                      </div>
                      <div>
                        <section className="comment-box row">
                          <CommentsByEntity
                            entityId={this.state.blog.id}
                            entityTypeId={this.state.blog.blogTypeId}
                            props={this.props}
                            currentUser={this.props.currentUser}
                          />
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      }
    } else if (this.state.isLoading === true) {
      return (
        <React.Fragment>
          <div>
            <h2>Loading....</h2>
          </div>
        </React.Fragment>
      );
    } else if (this.state.hasError === true) {
      return (
        <React.Fragment>
          <div>
            <div>
              <h1 style={{ color: "red" }}>
                No Blog Found. Please Return to Blog Home and Select Another
                Blog
              </h1>

              <NavLink className="btn btn-primary" type="button" to="/blogs">
                Return to Blogs Home
              </NavLink>
              <div
                className="container"
                style={{
                  maxHeight: "400px",
                  maxWidth: "600px",
                }}
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSfPImoLIWlVMEmjH86QwxGx2WHWfrTVmVM09dT1A5SnXxTSe3&s"
                  alt=""
                  className="img-fluid w-100 media"
                />
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}
ABlog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number,
    authorId: PropTypes.number,
    blogTypeId: PropTypes.number,
    author: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
    }),
    title: PropTypes.string,
    subject: PropTypes.string,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    datePublish: PropTypes.string,
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      blog: PropTypes.shape({
        id: PropTypes.number,
        authorId: PropTypes.number,
        blogTypeId: PropTypes.number,
        author: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          email: PropTypes.string,
        }),
        title: PropTypes.string,
        subject: PropTypes.string,
        content: PropTypes.string,
        imageUrl: PropTypes.string,
        datePublish: PropTypes.string,
      }),
    }),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ABlog;
