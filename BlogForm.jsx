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
        imageUrl: "",
        datePublish: "",
      },
      showModal: false,
    };
  }

  componentDidMount = () => {
    if (this.props.blog) {
      this.setState(() => {
        return (this.formValues = {
          blogTypeId: this.props.blog.blogTypeId,
          title: this.props.blog.title,
          subject: this.props.blog.subject,
          content: this.props.blog.content,
          isPublished: this.props.blog.isPublished,
          imageUrl: this.props.blog.imageUrl,
          datePublish: moment(this.props.blog.datePublish).format("YYYY-MM-DD"),
        });
      });
      _logger("formValues from props", this.state.formValues);
    }
  };

  showSaveSuccess = (response) => {
    _logger(response, "showSaveSuccess");
    toast("Success", { autoDismiss: 1 });
  };

  onSaveErrorGeneric = (error) => {
    _logger("Failed to save changes", error);
    toast("Failed to save changes:" + error.toString());
  };

  handleSubmit = (formValues) => {
    _logger(formValues);

    const blog = {
      id: formValues.id,
      blogTypeId: formValues.blogTypeId,
      title: formValues.title,
      subject: formValues.subject,
      content: formValues.content,
      isPublished: formValues.isPublished,
      imageUrl: formValues.imageUrl,
      datePublish: formValues.datePublish,
    };

    if (this.state.formValues.id) {
      blogService
        .updateBlog(blog)
        .then(this.showSaveSuccess)
        .catch(this.onSaveErrorGeneric);
    } else {
      blogService
        .addBlog(blog)
        .then(this.showSaveSuccess)
        .catch(this.onSaveErrorGeneric);
    }
  };
  onCancel = (resetForm) => {
    resetForm();
    this.props.closeModal();
  };

  handleDelete = () => {
    blogService
      .deleteBlog(this.state.formValues.id)
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
              resetForm,
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
                              Blog Type Id
                            </label>
                            <div className="col-sm-9">
                              <Field
                                className={
                                  errors.blogTypeId && touched.blogTypeId
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                type="number"
                                autoComplete="off"
                                name="blogTypeId"
                                placeholder="Blog Type Id"
                                value={values.blogTypeId}
                              />
                              {errors.blogTypeId && touched.blogTypeId && (
                                <span className="input-feedback">
                                  {errors.blogTypeId}
                                </span>
                              )}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row form-group">
                            <label
                              htmlFor="inputTitle"
                              className="col-sm-3 col-form-label"
                            >
                              Title
                            </label>
                            <div className="col-sm-9">
                              <Field
                                className={
                                  errors.title && touched.title
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="title"
                                type="text"
                                placeholder="Title"
                                value={values.title}
                                autoComplete="off"
                              />
                              {errors.title && touched.title && (
                                <span className="input-feedback">
                                  {errors.title}
                                </span>
                              )}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row form-group">
                            <label
                              htmlFor="inputSubject"
                              className="col-sm-3 col-form-label"
                            >
                              Subject
                            </label>
                            <div className="col-sm-9">
                              <Field
                                className={
                                  errors.subject && touched.subject
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="subject"
                                placeholder="Subject"
                                value={values.subject}
                                autoComplete="off"
                              />
                              {errors.subject && touched.subject && (
                                <span className="input-feedback">
                                  {errors.subject}
                                </span>
                              )}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row form-group">
                            <label
                              htmlFor="inputContent"
                              className="col-sm-3 col-form-label"
                            >
                              Content
                            </label>
                            <div className="col-sm-9">
                              <Field
                                name="content"
                                placeholder="Content"
                                component="textarea"
                                rows="6"
                                className={
                                  errors.content && touched.content
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                value={values.content}
                              />
                              {errors.content && touched.content && (
                                <span className="input-feedback">
                                  {errors.content}
                                </span>
                              )}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row form-group">
                            <label
                              htmlFor="inputImageUrl"
                              className="col-sm-3 col-form-label"
                            >
                              Image Url
                            </label>
                            <div className="col-sm-9">
                              <Field
                                name="imageUrl"
                                className={
                                  errors.imageUrl && touched.imageUrl
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                type="url"
                                placeholder="Input Image URL"
                                value={values.imageUrl}
                              />
                              {errors.imageUrl && touched.imageUrl && (
                                <span className="input-feedback">
                                  {errors.imageUrl}
                                </span>
                              )}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row form-group">
                            <label
                              htmlFor="inputDatePublish"
                              className="col-sm-3 col-form-label"
                            >
                              Date Published
                            </label>
                            <div className="col-sm-9">
                              <Field
                                className={
                                  errors.datePublish && touched.datePublish
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                name="datePublish"
                                type="date"
                                placeholder="Desired Publish Date"
                                value={values.datePublish}
                              />
                              {errors.datePublish && touched.datePublish && (
                                <span className="input-feedback">
                                  {errors.datePublish}
                                </span>
                              )}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="form-group m-checkbox-inline mb-0 sm-mb-checkbox">
                            <label>
                              Blog is Published
                              <div className="checkbox checkbox-primary">
                                <FastField
                                  name="isPublished"
                                  value={true}
                                  render={({ field }) => (
                                    <input
                                      style={{
                                        opacity: "unset",
                                      }}
                                      {...field}
                                      type="checkbox"
                                      name="isPublished"
                                      checked={props.values.isPublished}
                                      value="true"
                                    />
                                  )}
                                />
                              </div>
                            </label>
                          </div>
                        </FormGroup>
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
                            onClick={() => this.onCancel(resetForm)}
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
  closeModal: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default BlogForm;
