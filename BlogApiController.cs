using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Data;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Blogs;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/blogs")]
    [ApiController]
    public class BlogApiController : BaseApiController

    {
        private IBlogService _service = null;
        private IAuthenticationService<int> _authService = null;

        public BlogApiController(IBlogService service
            , ILogger<BlogApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Blog>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Blog blog = _service.GetById(id);
                if (blog == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource Not Found");
                    return NotFound404(response);
                }
                else
                {
                    response = new ItemResponse<Blog> { Item = blog };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"GenericException Error: {ex.Message}");

            }
            return StatusCode(iCode, response);
        }
        [HttpGet("pageinate")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Blog>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
          BaseResponse result = null;
            try
            {
                Paged<Blog> paged = _service.GetAll(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    result = new ErrorResponse("Records Not Found");
                }
                else
                {
                    result = new ItemResponse<Paged<Blog>> { Item = paged };

                  
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                result = new ErrorResponse(ex.Message.ToString());
            }
            return StatusCode(code, result);
        }

        [HttpGet("pageinate/current")]
        public ActionResult<ItemResponse<Paged<Blog>>> GetCurrent(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();

                Paged<Blog> paged = _service.Get(pageIndex, pageSize, userId);
                if (paged == null)
                {
                    code = 404;
                    result = new ErrorResponse("Records Not Found");
                }
                else
                {
                 
                  result = new ItemResponse<Paged<Blog>>{ Item = paged };
                  
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                new ErrorResponse(ex.Message.ToString());
            }
            return StatusCode(code, result);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Blog>>> SearchPaginated(int pageIndex, int pageSize, string searchCriteria)
        {
            int code = 200;
            BaseResponse result = null;
            try
            {
                Paged<Blog> paged = _service.SearchPaginated(pageIndex, pageSize, searchCriteria);
                if (paged == null)
                {
                    code = 404;
                    result = new ErrorResponse("Records Not Found");
                }
                else
                {

                    result = new ItemResponse<Paged<Blog>> { Item = paged };

                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                new ErrorResponse(ex.Message.ToString());
            }
            return StatusCode(code, result);
        }

            [HttpPost]
        public ActionResult<ItemResponse<int>> Create(BlogAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(BlogUpdateRequest model, int Id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId, Id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int Id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(Id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}
