using System.Collections.Generic;
using System.Threading.Tasks;
using FStudyForum.Core.Models.Entities;

namespace FStudyForum.Core.Interfaces.IRepositories
{
    public interface ICategoryRepository : IBaseRepository<Category>
    {
        public Task<List<Category>> GetCategoriesByIds(List<long> categoryIds);
        public Task<bool> CateExists(string categoryName);
        public Task<Category?> GetCateByName(string name);
        public Task<List<Category>> GetCategoriesByType(string type);
    }
}
