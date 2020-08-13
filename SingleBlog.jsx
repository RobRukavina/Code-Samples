import React from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import moment from "moment";
import "./blogsCss/blogs.css";

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
        <div className="mb-4 hover-animate col-sm-6 col-lg-4">
          <div className="border-0 h-100 shadow card">
            <div className="BlogsImageContainer">
              <img
                src={props.blog.imageUrl}
                alt=""
                className="BlogsImg2 card-img-top"
              />
            </div>
            <div className="card-body">
              <p>{props.blog.subject}</p>
              <h5 className="my-2">{props.blog.title}</h5>
              <div className="text-gray-500 text-sm my-3">
                <i className="far fa-clock mr-2" />
                <ul className="blog-social">
                  <li className="digits">
                    {moment(props.blog.datePublish).format("MM/DD/YYYY")}
                  </li>
                  <li className="digits">
                    {props.blog.author.firstName} {props.blog.author.lastName}
                  </li>
                  <li className="digits">0 Hits</li>
                </ul>
              </div>
              <p
                className="my-2 text-muted text-sm"
                style={{ maxHeight: "10px" }}
              >
                {props.blog.content.slice(0, 100)}
              </p>
            </div>
            <div className="btnCardFooter">
              <button className="btn btn-primary" onClick={onReadThis}>
                Read More
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else if (shouldIncludeButtons() !== true)
    return (
      <React.Fragment>
        {/* Some Code Removed */}
      </React.Fragment>
    );
};

SingleBlog.propTypes = {
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
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
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SingleBlog;
