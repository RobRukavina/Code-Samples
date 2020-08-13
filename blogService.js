import axios from "axios";
import * as serviceHelper from "./serviceHelpers";

const endpoint = `${serviceHelper.API_HOST_PREFIX}/api/blogs/`;

const addBlog = (payload) => {
  const config = {
    method: "POST",
    url: endpoint,
    data: payload,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const updateBlog = (data) => {
  const config = {
    method: "PUT",
    url: endpoint + data.id,
    data: data,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getAllBlogs = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint}pageinate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getAllBlogTypes = () => {
  const config = {
    method: "GET",
    url: `${endpoint}blogTypes`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getBlogById = (blogId) => {
  const config = {
    method: "GET",
    url: endpoint + `${blogId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getByCreatedBy = (data) => {
  const config = {
    method: "GET",
    url: endpoint + data.AuthorId,
    data: data,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const searchBlog = (pageIndex, pageSize, search) => {
  const config = {
    method: "GET",
    url: `${endpoint}searchPaginate?pageIndex=${pageIndex}&pageSize=${pageSize}&searchCriteria=${search}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const deleteBlog = (deletedBlogId) => {
  const config = {
    method: "DELETE",
    url: endpoint + `${deletedBlogId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

export {
  addBlog,
  getAllBlogs,
  getBlogById,
  getByCreatedBy,
  updateBlog,
  searchBlog,
  deleteBlog,
  getAllBlogTypes,
};
