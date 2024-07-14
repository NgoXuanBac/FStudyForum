
using AutoMapper;
using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.Category;
using FStudyForum.Core.Models.Entities;
namespace FStudyForum.Infrastructure.Services;

public class CategoryService : ICategoryService
{

    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public CategoryService(
        ICategoryRepository categoryRepository,
        IMapper mapper)
    {
        _mapper = mapper;
        _categoryRepository = categoryRepository;
    }
    public async Task<List<CategoryDTO>> GetAllCategory()
    {
        var categories = await _categoryRepository.GetAll();
        var categoryDTOs = new List<CategoryDTO>();
        foreach (var categorie in categories)
        {
            categoryDTOs.Add(new CategoryDTO
            {
                Id = categorie.Id,
                Name = categorie.Name,
                Description = categorie.Description,
                Type = categorie.Type
            });
        }
        return categoryDTOs;
    }
    public async Task<CategoryDTO> CreateCategory(CreateCategoryDTO categoryDto)
    {
        if (await _categoryRepository.CateExists(categoryDto.Name))
        {
            var errorMessage = "Category Exist";
            throw new Exception(errorMessage);
        }
        var categories = new Category
        {
            Name = categoryDto.Name,
            Description = categoryDto.Description,
            Type = categoryDto.Type
        };
        var createdCategory = await _categoryRepository.Create(categories);
        await _categoryRepository.SaveChangeAsync();
        var createdCategoryDto = _mapper.Map<CategoryDTO>(createdCategory);
        return createdCategoryDto;
    }

    public async Task<CategoryDTO> GetCateByName(string name)
    {
       var category = await _categoryRepository.GetCateByName(name);
        if (category == null)
        {
            throw new Exception("Category not found");
        } 
        var categoryDto = new CategoryDTO
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            Type= category.Type 
        };

        return categoryDto;
    }

    public async Task<CategoryDTO> UpdateCategory(string name, UpdateCategoryDTO categoryDto)
{
    var existedCategory = await _categoryRepository.GetCateByName(name)
        ?? throw new Exception("Category not found");
    var categoryWithSameName = await _categoryRepository.GetCateByName(categoryDto.Name);
    if (categoryWithSameName != null && categoryWithSameName.Id != existedCategory.Id)
    {
        throw new Exception($"Category with name '{categoryDto.Name}' already exists.");
    }
    existedCategory.Name = categoryDto.Name;
    existedCategory.Description = categoryDto.Description;
    existedCategory.Type = categoryDto.Type;

    await _categoryRepository.Update(existedCategory);
    return _mapper.Map<CategoryDTO>(existedCategory);
}

    public async Task<bool> DeleteCategory(string name)
    {
         var existedCategory = await _categoryRepository.GetCateByName(name)
        ?? throw new Exception("Category not found");
        await _categoryRepository.Delete(existedCategory);
        return true;
    }
     public async Task<IEnumerable<CategoryDTO>> FilterCategoriesByType(string type) 
        {
            var categories = await _categoryRepository.GetCategoriesByType(type);
            var categoryDTOs = categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Type = c.Type
            });

            return categoryDTOs;
        }
}

