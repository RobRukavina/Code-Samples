import React from "react";
import _logger from "sabio-debug";
import * as blogService from "../../services/blogService";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import SingleBlog from "./SingleBlog";
import PropTypes from "prop-types";
import locale from "rc-pagination/lib/locale/en_US";
import moment from "moment";
import { Modal, Container, Button } from "reactstrap";
import BlogForm from "../Blogs/BlogForm";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import FileUpload from "../files/FileUpload";
import blogSearchSchema from "../../schemas/blogSearchSchema";

class Blogs extends React.Component {
  constructor(props) {
    super(props);
    _logger("constructor");
    this.state = {
      blogs: [],
      mappedBlogs: [],
      searchTerms: { search: "" },
      total: 0,
      pageIndex: 0,
      pageSize: 12,
      currentPage: 1,
      showModal: false,
      search404: false,
    };
  }

  componentDidMount = () => {
    _logger("componentDidMount");
    this.getAll(this.state.pageIndex, this.state.pageSize);
  };

  getAll = () => {
    blogService
      .getAllBlogs(this.state.pageIndex, this.state.pageSize)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  handleSearch = (values) => {
    blogService
      .searchBlog(this.state.pageIndex, this.state.pageSize, values.search)
      .then(this.onGetAllSuccess)
      .catch(this.onSearchError);
    _logger("searching for", values.search);
  };

  onSearchError = (error) => {
    this.searchError();
    _logger("search error", error);
    toast("No Blog Found. Please Try Another Search", error.toString());
  };

  searchError = () => {
    this.setState(() => {
      return { search404: true };
    });
  };

  onChange = (page, pageSize) => {
    blogService
      .getAllBlogs(page - 1, pageSize)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
    this.setState(() => {
      this.currentPage = { currentPage: page };
    });
  };

  uploadedFiles = (uploadedFiles) => {
    _logger("Returned Ids: ", uploadedFiles);

    this.setState(() => {
      return { currentImages: uploadedFiles };
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
    this.getAll();
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  returnToBlogs = () => {
    window.location.reload(false);
  };

  render() {
    const frontBlog = this.state.blogs.length > 0 ? this.state.blogs[0] : null;
    const topBlog = this.state.blogs.length > 1 ? this.state.blogs[1] : null;
    const bottomBlog = this.state.blogs.length > 2 ? this.state.blogs[2] : null;
    if (this.state.search404) {
      return (
        <React.Fragment>
          <div>
            <div>
              <h1 style={{ color: "red" }}>
                No Blog Found. Please Return to Blog Home and Select Another
                Blog
              </h1>

              <button
                className="btn btn-primary"
                type="button"
                onClick={this.returnToBlogs}
              >
                Return to Blogs Home
              </button>
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
    } else {
      if (this.shouldIncludeButtons() === true) {
        return (
          <React.Fragment>
            <Formik
              enableReinitialize={true}
              initialValues={this.state.searchTerms}
              onSubmit={this.handleSearch}
              validationSchema={blogSearchSchema}
            >
              {(props) => {
                const { values, isValid } = props;
                return (
                  <React.Fragment>
                    <div className="blogs-page-body">
                      <div className="container-fluid">
                        <div className="blogsSearchHeader row">
                          <div
                            className="col-12"
                            style={{ textAlign: "center" }}
                          >
                            <h4 className="blogs-header">Blogs Home Page</h4>
                          </div>
                          <div>
                            <button
                              className="btn btn-primary"
                              type="button"
                              onClick={this.handleOpenModal}
                            >
                              Create A New Blog
                            </button>
                            <div className="blogSearchBoxContainer">
                              <Form>
                                <div className="BlogDisplayInline">
                                  <Field
                                    className="blogSearchBox form-control"
                                    name="search"
                                    placeholder="Search Blogs"
                                    autoComplete="on"
                                    type="text"
                                    value={values.search}
                                  ></Field>
                                </div>
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                  disabled={!isValid}
                                >
                                  Search
                                </button>
                              </Form>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="blogs-container-fluid">
                        <div className="row">
                          {frontBlog && (
                            <div className="frontBlog col-xl-6 set-col-12">
                              <div className="card">
                                <div className="blog-box blog-shadow">
                                  <div className="TopBlogsImageContainer">
                                    <img
                                      src={
                                        frontBlog.imageUrl
                                          ? frontBlog.imageUrl
                                          : "https://cdn.mos.cms.futurecdn.net/iuWB2NM48R2r9q7QhyJfhe-1200-80.jpg"
                                      }
                                      alt="/universal/static/media/blog-3.2b4c49a1.jpg"
                                      className="BlogsImg2 card-img-top"
                                    />
                                  </div>
                                  <div className="blog-details">
                                    <p className="digits">
                                      {moment(frontBlog.datePublish).format(
                                        "MM/DD/YYYY"
                                      )}
                                    </p>
                                    <h4>{frontBlog.title}</h4>

                                    <ul className="blog-social">
                                      <li>
                                        <i className="icofont icofont-user" />
                                        {frontBlog.author.firstName}{" "}
                                        {frontBlog.author.lastName}
                                      </li>
                                      <li className="digits">
                                        <i className="icofont icofont-thumbs-up" />
                                        02 Hits
                                      </li>
                                      <li className="digits">
                                        <i className="icofont icofont-ui-chat" />
                                        598 Comments
                                      </li>
                                    </ul>
                                    <div
                                      className="inline"
                                      style={{
                                        alignSelf: "center",
                                        paddingTop: "0.5rem",
                                      }}
                                    >
                                      <button
                                        className="btn btn-primary"
                                        onClick={this.onReadFrontBlog}
                                        type="button"
                                      >
                                        Read More
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="topBlogs col-xl-6 set-col-12">
                            {topBlog && (
                              <div className="card">
                                <div className="blog-box blog-list row">
                                  <div className="col-sm-5">
                                    <div className="BlogsImageContainer">
                                      <img
                                        src={
                                          topBlog.imageUrl
                                            ? topBlog.imageUrl
                                            : "/universal/static/media/blog-3.2b4c49a1.jpg"
                                        }
                                        alt="/universal/static/media/blog-3.2b4c49a1.jpg"
                                        className="img-fluid sm-100-w media"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-7">
                                    <div className="blog-details-padded">
                                      <div className="blog-date digits">
                                        {moment(topBlog.datePublish).format(
                                          "MM/DD/YYYY"
                                        )}
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
                                        <p className="mt-0">
                                          {topBlog.subject}
                                        </p>
                                        <div
                                          className="inline"
                                          style={{
                                            paddingBottom: "0.5rem",
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
                                <div className="blog-box blog-list row">
                                  <div className="col-sm-5">
                                    <div className="BlogsImageContainer">
                                      <img
                                        src={
                                          bottomBlog.imageUrl
                                            ? bottomBlog.imageUrl
                                            : "/universal/static/media/blog-3.2b4c49a1.jpg"
                                        }
                                        style={{
                                          objectFit: "cover",
                                          height: "100%",
                                          width: "100%",
                                        }}
                                        alt="/universal/static/media/blog-3.2b4c49a1.jpg"
                                        className="img-fluid sm-100-w media"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-sm-7">
                                    <div className="blog-details-padded">
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
                                        <p className="mt-0">
                                          {bottomBlog.subject}
                                        </p>
                                        <div
                                          className="inline"
                                          style={{
                                            paddingBottom: "0.5rem",
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
                          <div className="mb-5 row">
                            {this.state.mappedBlogs}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Container>
                      <Modal
                        centered={true}
                        size="lg"
                        isOpen={this.state.showModal}
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
                              onClick={this.handleCloseModal}
                            >
                              x
                            </button>
                          </div>
                          <h2>Create or Edit Your Blog</h2>
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
              }}
            </Formik>
          </React.Fragment>
        );
      } else if (this.shouldIncludeButtons !== true) {
        return (
          <React.Fragment>
            <Formik
              enableReinitialize={true}
              initialValues={this.state.searchTerms}
              onSubmit={this.handleSearch}
              validationSchema={blogSearchSchema}
            >
              {(props) => {
                const { values, isValid } = props;
                return (
                  <React.Fragment>
                    {/* Code Removed */}
                  </React.Fragment>
                );
              }}
            </Formik>
          </React.Fragment>
        );
      }
    }
  }
}
Blogs.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};
export default Blogs;
