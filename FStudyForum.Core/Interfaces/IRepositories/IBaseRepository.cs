using FStudyForum.Core.Models.DTOs;

namespace FStudyForum.Core.Interfaces.IRepositories;

public interface IBaseRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAll();
    Task<IEnumerable<T>> GetQuery(QueryParameters query);
    Task<int> CountAsync();
    Task<PaginatedData<T>> GetPaginatedData(int pageNumber, int pageSize);
    Task<T> GetById<Tid>(Tid id);
    Task<bool> IsExists<Tvalue>(string key, Tvalue value);
    Task<bool> IsExistsForUpdate<Tid>(Tid id, string key, string value);
    Task<T> Create(T model);
    Task CreateRange(List<T> model);
    Task Update(T model);
    Task Delete(T model);
    Task SaveChangeAsync();
}
