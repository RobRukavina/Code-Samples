import React from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import moment from "moment";

const _logger = debug.extend("SingleBlog");

const SingleBlog = (props) => {
  _logger(`rendering ${props.blog.id}`, { props });

  let shouldIncludeButtons = () => {
    let result = false;
    if (props.currentUser.roles.includes("Admin")) {
      result = true;
    } else if (props.currentUser.roles.includes("Vendor")) {
      result = true;
    } else {
      result = false;
    }
    return result;
  };

  let onReadThis = () => {
    if (shouldIncludeButtons() === true) {
      props.history.push(`/blogs/${props.blog.id}/view/admin`, props.blog);
    } else {
      props.history.push(`/blogs/${props.blog.id}/view`, props.blog);
    }
    _logger("From props.history.push on Blogs", props.blog);
  };

  if (shouldIncludeButtons() === true) {
    return (
      <React.Fragment>
        <div className="col-md-3 col-xl-3 set-col-3">
          <div
            className="card"
            style={{ minHeight: "25rem", maxHeight: "25rem" }}
          >
            <div className="blog-box blog-grid text-center">
              <img
                src={props.blog.imageUrl}
                alt=""
                className="img-fluid top-radius-blog media"
                style={{ objectFit: "cover", maxHeight: "300px" }}
              />
              <div className="blog-details-main">
                <ul className="blog-social">
                  <li className="digits">
                    {moment(props.blog.datePublish).format("MM/DD/YYYY")}
                  </li>
                  <li className="digits">
                    By: {props.blog.author.firstName}{" "}
                    {props.blog.author.lastName}
                  </li>
                  <li className="digits">0 Hits</li>
                </ul>
                <hr />
                <h6 className="blog-bottom-details d-sm-none d-none d-sm-block">
                  Title: {props.blog.title} Subject: {props.blog.subject}
                </h6>
              </div>
            </div>
            <div
              className="inline"
              style={{
                alignSelf: "center",
              }}
            >
              <button
                className="btn btn-primary"
                style={{
                  alignSelf: "center",
                }}
                onClick={onReadThis}
              >
                Read More
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else if (shouldIncludeButtons() !== true)
   
};

SingleBlog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number,
    authorId: PropTypes.number,
    blogTypeId: PropTypes.number,
    author: PropTypes.object,
    title: PropTypes.string,
    subject: PropTypes.string,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    datePublish: PropTypes.string,
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string,
    isPublished: PropTypes.bool,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  location: PropTypes.shape({
    state: PropTypes.object,
    blog: PropTypes.object,
  }),
  currentUser: PropTypes.shape({
    roles: PropTypes.array,
  }),
};

export default SingleBlog;
