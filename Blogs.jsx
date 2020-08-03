import React from "react";
import _logger from "sabio-debug";
import { getAllBlogs } from "../../services/blogService";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import SingleBlog from "./SingleBlog";
import PropTypes from "prop-types";
import locale from "rc-pagination/lib/locale/en_US";
import moment from "moment";
import { Modal, Container, Button } from "reactstrap";
import BlogForm from "../Blogs/BlogForm";

class Blogs extends React.Component {
  constructor(props) {
    super(props);
    _logger("constructor");

    this.state = {
      blogs: [],
      mappedBlogs: [],
      total: 0,
      pageIndex: 0,
      pageSize: 11,
      currentPage: 1,
      showModal: false,
    };
  }

  componentDidMount = () => {
    _logger("componentDidMount");
    this.getAll(this.state.pageIndex, this.state.pageSize);
  };

  getAll = () => {
    getAllBlogs(this.state.pageIndex, this.state.pageSize)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  onChange = (page, pageSize) => {
    getAllBlogs(page - 1, pageSize)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
    this.setState(() => {
      this.currentPage = { currentPage: page };
    });
  };

  onGetAllSuccess = (response) => {
    _logger(response);
    let blogs = [...response.item.pagedItems];
    response.item.pagedItems.splice(0, 3);
    this.setState((prevState) => {
      return {
        ...prevState,
        blogs,
        mappedBlogs: response.item.pagedItems.map(this.mapBlog),
        total: response.item.totalCount,
        pageIndex: response.item.pageIndex,
        currentPage: response.item.pageIndex - 1,
      };
    });
  };

  onGetAllError = (error) => {
    _logger("onGetAllBlogs", error);
  };

  mapBlog = (aBlog) => {
    return <SingleBlog blog={aBlog} key={aBlog.id} {...this.props} />;
  };

  onReadFrontBlog = () => {
    const frontBlog = this.state.blogs.length > 0 ? this.state.blogs[0] : null;
    if (this.shouldIncludeButtons() === true) {
      this.props.history.push(`/blogs/${frontBlog.id}/view/admin`, frontBlog);
    } else {
      this.props.history.push(`/blogs/${frontBlog.id}/view`, frontBlog);
    }
    _logger("From props.history.push on Blogs", this.state.blogs.frontBlog);
  };

  onReadTopBlog = () => {
    const topBlog = this.state.blogs.length > 1 ? this.state.blogs[1] : null;
    if (this.shouldIncludeButtons() === true) {
      this.props.history.push(`/blogs/${topBlog.id}/view/admin`, topBlog);
    } else {
      this.props.history.push(`/blogs/${topBlog.id}/view`, topBlog);
    }
    _logger("From props.history.push on Blogs", topBlog);
  };

  onReadBottomBlog = () => {
    const bottomBlog = this.state.blogs.length > 2 ? this.state.blogs[2] : null;
    if (this.shouldIncludeButtons() === true) {
      this.props.history.push(`/blogs/${bottomBlog.id}/view/admin`, bottomBlog);
    } else {
      this.props.history.push(`/blogs/${bottomBlog.id}/view`, bottomBlog);
    }
    _logger("From props.history.push on Blogs", bottomBlog);
  };

  shouldIncludeButtons = () => {
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

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  render() {
    const frontBlog = this.state.blogs.length > 0 ? this.state.blogs[0] : null;
    const topBlog = this.state.blogs.length > 1 ? this.state.blogs[1] : null;
    const bottomBlog = this.state.blogs.length > 2 ? this.state.blogs[2] : null;
// Some code removed to be fair to my client
    if (this.shouldIncludeButtons() === true) {
      return (
        <React.Fragment>
          <div className="page-body">
            <div className="container-fluid" style={{ padding: "2px" }}>
              <h4 style={{ textAlign: "center" }}>Blogs Home Page</h4>
              <button
                className="btn btn-primary"
                type="button"
                onClick={this.handleOpenModal}
              >
                Create A New Blog
              </button>
            </div>
                <div className="col-xl-6 set-col-12">
                  {topBlog && (
                    <div className="card">
                      <div
                        className="blog-box blog-list row"
                        style={{ minHeight: "16.86rem", maxHeight: "16.86rem" }}
                      >
                        <div className="col-sm-5">
                          <img
                            src={
                              topBlog.imageUrl
                                ? topBlog.imageUrl
                                : "/universal/static/media/blog-3.2b4c49a1.jpg"
                            }
                            style={{ maxHeight: "281px" }}
                            alt="/universal/static/media/blog-3.2b4c49a1.jpg"
                            className="img-fluid sm-100-w media"
                          />
                        </div>
                        <div className="col-sm-7">
                          <div className="blog-details">
                            <div className="blog-date digits">
                              {moment(topBlog.datePublish).format("MM/DD/YYYY")}
                            </div>
                            <h6>{topBlog.title}</h6>
                            <div className="blog-bottom-content">
                              <ul className="blog-social">
                                <li>
                                  By: {topBlog.author.firstName}{" "}
                                  {topBlog.author.lastName}
                                </li>
                                <li className="digits">0 Hits</li>
                              </ul>
                              <hr />
                              <p className="mt-0">{topBlog.subject}</p>
                              <div
                                className="inline"
                                style={{
                                  alignSelf: "center",
                                }}
                              >
                                <button
                                  className="btn btn-primary"
                                  onClick={this.onReadTopBlog}
                                  type="button"
                                >
                                  Read More
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {bottomBlog && (
                    <div className="card">
                      <div
                        className="blog-box blog-list row"
                        style={{
                          minHeight: "16.86rem",
                          maxHeight: "16.86rem",
                        }}
                      >
                        <div className="col-sm-5">
                          <img
                            src={
                              bottomBlog.imageUrl
                                ? bottomBlog.imageUrl
                                : "/universal/static/media/blog-3.2b4c49a1.jpg"
                            }
                            style={{ maxHeight: "281px" }}
                            alt="/universal/static/media/blog-3.2b4c49a1.jpg"
                            className="img-fluid sm-100-w media"
                          />
                        </div>
                        <div className="col-sm-7">
                          <div className="blog-details">
                            <div className="blog-date digits">
                              {moment(bottomBlog.datePublish).format(
                                "MM/DD/YYYY"
                              )}
                            </div>
                            <h6>{bottomBlog.title}</h6>
                            <div className="blog-bottom-content">
                              <ul className="blog-social">
                                <li>
                                  By: {bottomBlog.author.firstName}{" "}
                                  {bottomBlog.author.lastName}
                                </li>
                                <li className="digits">02 Hits</li>
                              </ul>
                              <hr />
                              <p className="mt-0">{bottomBlog.subject}</p>
                              <div
                                className="inline"
                                style={{
                                  alignSelf: "center",
                                }}
                              >
                                <button
                                  className="btn btn-primary"
                                  onClick={this.onReadBottomBlog}
                                  type="button"
                                >
                                  Read More
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {this.state.mappedBlogs}
              </div>
            </div>
          </div>
          <Container>
            <Modal centered={true} size="lg" isOpen={this.state.showModal}>
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
                    onClick={this.handleCloseModal}
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
              <BlogForm
                blog={this.state.blog}
                onEdit={this.handleOpenModal}
                closeModal={this.handleCloseModal}
                showModal={this.state.showModal}
              />
            </Modal>
          </Container>
          <Pagination
            pageSize={this.state.pageSize}
            pageIndex={this.state.pageIndex}
            onChange={this.onChange}
            currentPage={this.state.current}
            total={this.state.total}
            locale={locale}
            nextIcon="Next"
            prevIcon="Prev"
          />
        </React.Fragment>
      );
  
Blogs.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  currentUser: PropTypes.shape({
    roles: PropTypes.array,
  }),
};
export default Blogs;
