import React from "react";
import _logger from "sabio-debug";
import { Formik, Field, Form, FastField } from "formik";
import * as blogService from "../../services/blogService";
import blogSchema from "../../schemas/blogSchema";
import { FormGroup } from "reactstrap";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

class BlogForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        id: "",
        blogTypeId: "",
        title: "",
        subject: "",
        content: "",
        isPublished: false,
        datePublish: "",
      },
      showModal: false,
      blogTypes: [],
    };
  }

  componentDidMount = () => {
    this.getTypes();
    _logger("Blog Types From ComponentDidMount", this.state.blogTypes);
    if (this.props.blog) {
      this.setState({
        formValues: {
          id: this.props.blog.id,
          blogTypeId: this.props.blog.blogTypeId,
          title: this.props.blog.title,
          subject: this.props.blog.subject,
          content: this.props.blog.content,
          isPublished: this.props.blog.isPublished,
          datePublish: moment(this.props.blog.datePublish).format("YYYY-MM-DD"),
        },
      });
      _logger("formValues from props", this.props.blog);
    }
  };

  getTypes = () => {
    blogService
      .getAllBlogTypes()
      .then(this.onGetTypesSuccess)
      .catch(this.onGetTypesError);
  };

  mapTypes = (option) => {
    return (
      <option key={option.id} value={option.id}>
        {option.name}
      </option>
    );
  };

  onGetTypesSuccess = (response) => {
    _logger("BlogTypes", response);
    let options = response.item.map(this.mapTypes);
    this.setState(() => {
      return { blogTypes: options };
    });
  };

  onGetTypesError = (error) => {
    _logger("BlogTypes", error);
  };

  showSaveSuccess = (response) => {
    _logger(response, "showSaveSuccess");
    toast("Success", { autoDismiss: 1 });
    this.props.getById();
    this.props.closeModal();
  };

  onSaveSuccess = (response) => {
    _logger(response, "showSaveSuccess");
    toast("Success", { autoDismiss: 1 });
    this.props.closeModal();
  };

  onSaveErrorGeneric = (error) => {
    _logger("Failed to save changes", error);
    toast("Failed to save changes:" + error.toString());
  };

  handleSubmit = (formValues) => {
    _logger(formValues);
    formValues.blogTypeId = parseInt(formValues.blogTypeId);
    const blog = {
      id: formValues.id,
      blogTypeId: formValues.blogTypeId,
      title: formValues.title,
      subject: formValues.subject,
      content: formValues.content,
      isPublished: formValues.isPublished,
      imageUrl: this.props.currentImages
        ? this.props.currentImages[0].url
        : this.props.blog.imageUrl
        ? this.props.blog.imageUrl
        : "",
      datePublish: formValues.datePublish,
    };

    if (formValues.id) {
      blogService
        .updateBlog(blog)
        .then(this.showSaveSuccess)
        .catch(this.onSaveErrorGeneric);
    } else {
      blogService
        .addBlog(blog)
        .then(this.onSaveSuccess)
        .catch(this.onSaveErrorGeneric);
    }
  };

  onCancel = () => {
    this.props.closeModal();
  };

  handleDelete = () => {
    blogService
      .deleteBlog(this.props.blog.id)
      .then(this.onDeleteSuccess)
      .catch(this.onDeleteError);
  };

  onDeleteError = (error) => {
    toast.error("onDeleteError", error);
  };

  onDeleteSuccess = (response) => {
    _logger("Blog has been Deleted", response);
    toast.success("Blog has been Deleted", response);
    this.props.history.push("/blogs/admin");
    this.props.closeModal();
  };

  render() {
    return (
      <React.Fragment>
        <Formik
          validationSchema={blogSchema}
          enableReinitialize={true}
          initialValues={this.state.formValues}
          onSubmit={this.handleSubmit}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleSubmit,
              isValid,
              isSubmitting,
            } = props;
            return (
              <Form onSubmit={handleSubmit} className="theme-form">
                <ToastContainer />
                <div className="page-body">
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-body">
                        <FormGroup>
                          <div className="row form-group">
                            <label
                              htmlFor="inputBlogTypeId"
                              className="col-sm-3 col-form-label"
                            >
                              Blog Category
                            </label>
                            <div className="col-sm-9">
                              <Field
                                name="blogTypeId"
                                component="select"
                                values={values.blogTypeId}
                                label="BlogTypes"
                                className={
                                  errors.blogTypeId && touched.blogTypeId
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                              >
                                <option value="">Select Category</option>
                                {this.state.blogTypes}
                              </Field>
                              {errors.blogTypeId && touched.blogTypeId && (
                                <span className="input-feedback">
                                  {errors.blogTypeId}
                                </span>
                              )}
                            </div>
                          </div>
                        </FormGroup>
                                {/* Some Code Removed */}
                        <div
                          className="inline"
                          style={{ justifyContent: "center" }}
                        >
                          <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={!isValid || isSubmitting}
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            onClick={this.onCancel}
                            className="btn btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={this.handleDelete}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </React.Fragment>
    );
  }
}

BlogForm.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number,
    blogTypeId: PropTypes.number,
    title: PropTypes.string,
    subject: PropTypes.string,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    datePublish: PropTypes.string,
    isPublished: PropTypes.bool,
    toastr: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  currentImages: PropTypes.arrayOf({
    currentImages: PropTypes.url,
  }),
  closeModal: PropTypes.func,
  handleDelete: PropTypes.func,
  getById: PropTypes.func,
};

export default BlogForm;
