using Microsoft.AspNetCore.Mvc;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.Category;
using FStudyForum.Core.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using FStudyForum.Core.Constants;

namespace FStudyForum.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllCategory();
            return Ok(new Response
            {
                Message = "Get all categories successfully",
                Status = ResponseStatus.SUCCESS,
                Data = categories
            });
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDTO categoryDto)
        {
            var createdCategory = await _categoryService.CreateCategory(categoryDto);
            return CreatedAtAction(nameof(GetCateByName), new { name = createdCategory.Name }, createdCategory);
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetCateByName(string name)
        {
            try
            {
                var category = await _categoryService.GetCateByName(name);
                return Ok(category);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpPut("update/{name}")]
        public async Task<IActionResult> UpdateCategory(string name, [FromBody] UpdateCategoryDTO categoryDto)
        {
            try
            {
                var updatedCategory = await _categoryService.UpdateCategory(name, categoryDto);
                return Ok(updatedCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpDelete("delete/{name}")]
    public async Task<IActionResult> DeleteCategory(string name)
    {
        try
        {
            var success = await _categoryService.DeleteCategory(name);
            if (!success)
            {
                return NotFound(new { message = $"Category with name '{name}' not found." });
            }
            return Ok(new { message = $"{name} has been deleted successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
        }
    }
    [HttpGet("filter")]
    public async Task<IActionResult> GetFilteredCategories([FromQuery] string type)
    {
        var categories = await _categoryService.FilterCategoriesByType(type);
        return Ok(categories);
    }
    }
}