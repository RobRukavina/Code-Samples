using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Blogs;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Text;

namespace Sabio.Services
{
    public class BlogService : IBlogService
    {
        IDataProvider _data = null;

        public BlogService(IDataProvider data)
        {
            _data = data;
        }
        public int Add(BlogAddRequest model, int userId)
        {
            int Id = 0;
            string procName = "[dbo].[Blogs_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@AuthorId", userId);
                AddCommonParams(model, col);
                
                
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                
                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out Id);
            });
            return Id;
        }

        public void Update(BlogUpdateRequest model, int userId, int Id)
        {
            string procName = "[dbo].[Blogs_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@AuthorId", userId);
                    col.AddWithValue("@Id", Id);
                },
                
                returnParameters: null);
        }

        public Blog GetById(int Id)
        {
            string procName = "[dbo].[Blogs_Select_ById_V2]";
            Blog aBlog = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramsCollection)
            {
                paramsCollection.AddWithValue("@Id", Id);
            },
            delegate (IDataReader reader, short set)
            {
                aBlog = MapBlog(reader, out int startingIndex);                
            });
            return aBlog;
        }

        public Paged<Blog> GetAll(int pageIndex, int pageSize)
        {
            Paged<Blog> pagedList = null;
            List<Blog> list = null;
            int totalCount = 0;
            
            _data.ExecuteCmd(
                "dbo.Blogs_SelectAll_Paginated_V2",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Blog aBlog = MapBlog(reader, out int startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);
                    if (list == null)
                    {
                        list = new List<Blog>();
                    }
                    list.Add(aBlog);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<Blog>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public List<BlogTypes> GetAllTypes()
        {
            List<BlogTypes> list = null;

            _data.ExecuteCmd(
                "dbo.BlogTypes_SelectAll",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    BlogTypes aBlogType = MapBlogTypes(reader, out int startingIndex);
                    if (list == null)
                    {
                        list = new List<BlogTypes>();
                    }
                    list.Add(aBlogType);
                }
                );
            if (list != null)
            {
                list = new List<BlogTypes>(list);
            }
            return list;
        }

        public Paged<Blog> Get(int pageIndex, int pageSize, int userId)
        {
            
            Paged<Blog> pagedList = null;
            List<Blog> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "dbo.Blogs_Select_ByCreatedBy_Paginated_V2",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                    parameterCollection.AddWithValue("@AuthorId", userId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    
                    Blog aBlog = MapBlog(reader, out int startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);
                    if (list == null)
                    {
                        list = new List<Blog>(startingIndex++);
                    }
                    list.Add(aBlog);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<Blog>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Blog> SearchPaginated(int pageIndex, int pageSize, string searchCriteria)
        {
            Paged<Blog> pagedList = null;
            List<Blog> list = null;
            int totalCount = 0;
            _data.ExecuteCmd(
                "dbo.Blogs_Search_Paginated_V2",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@searchCriteria", searchCriteria);
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                    
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    
                    Blog aBlog = MapBlog(reader, out int startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);
                    if (list == null)
                    {
                        list = new List<Blog>(startingIndex++);
                    }
                    list.Add(aBlog);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<Blog>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public void Delete(int Id)
        {
            string procName = "[dbo].[Blogs_Delete_ById]";
                _data.ExecuteNonQuery(procName,
                    inputParamMapper: delegate (SqlParameterCollection col)
                    {
                        col.AddWithValue("@Id", Id);
                    },
                    returnParameters: null);
        }

        private static void AddCommonParams(BlogAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@BlogTypeId", model.BlogTypeId);
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@Content", model.Content);
            col.AddWithValue("@IsPublished", model.IsPublished);
            col.AddWithValue("@ImageUrl", model.ImageUrl);
            col.AddWithValue("@DatePublish", model.DatePublish);
        }

        private static Blog MapBlog(IDataReader reader, out int startingIndex)
        {
            Blog aBlog = new Blog();
            startingIndex = 0;
            aBlog.Id = reader.GetSafeInt32(startingIndex++);
            aBlog.BlogTypeId = reader.GetSafeInt32(startingIndex++);
            aBlog.AuthorId = reader.GetSafeInt32(startingIndex++);
            aBlog.Author = new BaseUser();
            aBlog.Author.FirstName = reader.GetSafeString(startingIndex++);
            aBlog.Author.LastName = reader.GetSafeString(startingIndex++);
            aBlog.Author.Email = reader.GetSafeString(startingIndex++);
            aBlog.Title = reader.GetSafeString(startingIndex++);
            aBlog.Subject = reader.GetSafeString(startingIndex++);
            aBlog.Content = reader.GetSafeString(startingIndex++);
            aBlog.IsPublished = reader.GetSafeBool(startingIndex++);
            aBlog.ImageUrl = reader.GetSafeString(startingIndex++);
            aBlog.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aBlog.DateModified = reader.GetSafeDateTime(startingIndex++);
            aBlog.DatePublish = reader.GetSafeDateTime(startingIndex++);
           
            return aBlog;
        }

        private static BlogTypes MapBlogTypes(IDataReader reader, out int startingIndex)
        {
            BlogTypes aBlogType = new BlogTypes();
            startingIndex = 0;
            aBlogType.Id = reader.GetSafeInt32(startingIndex++);
            aBlogType.Name = reader.GetSafeString(startingIndex++);

            return aBlogType;
        }
    }
}
