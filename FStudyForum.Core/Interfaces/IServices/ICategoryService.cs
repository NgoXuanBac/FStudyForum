
using FStudyForum.Core.Models.DTOs.Category;
namespace FStudyForum.Core.Interfaces.IServices;

public interface ICategoryService 
{
    public Task<List<CategoryDTO>> GetAllCategory();   
    public Task<CategoryDTO> CreateCategory(CreateCategoryDTO categoryDto);
    public Task<CategoryDTO> GetCateByName(string name);
    public Task<CategoryDTO> UpdateCategory(string name, UpdateCategoryDTO categoryDto);
    public Task<bool> DeleteCategory(string name);
     public Task<IEnumerable<CategoryDTO>> FilterCategoriesByType(string type);
}

