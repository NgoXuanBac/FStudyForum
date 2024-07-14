using System.Linq.Expressions;
using FStudyForum.Core.Models.DTOs;
using FStudyForum.Core.Exceptions;
using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using FStudyForum.Core.Helpers;

namespace FStudyForum.Infrastructure.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : class
{
    protected readonly ApplicationDBContext _dbContext;
    protected DbSet<T> DbSet => _dbContext.Set<T>();

    public BaseRepository(ApplicationDBContext dbContext)
    {
        _dbContext = dbContext;
    }

    public virtual async Task<IEnumerable<T>> GetAll()
    {
        var data = await _dbContext.Set<T>()
            .AsNoTracking()
            .ToListAsync();
        return data;
    }

    public virtual async Task<PaginatedData<T>> GetPaginatedData(int pageNumber, int pageSize)
    {
        var data = await _dbContext.Set<T>()
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalCount = await _dbContext.Set<T>().CountAsync();

        return new PaginatedData<T>(data, totalCount);
    }

    public virtual async Task<T> GetById<Tid>(Tid id)
    {
        var data = await _dbContext.Set<T>().FindAsync(id)
            ?? throw new NotFoundException("No data found");
        return data;
    }

    public virtual async Task<bool> IsExists<Tvalue>(string key, Tvalue value)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.Property(parameter, key);
        var constant = Expression.Constant(value);
        var equality = Expression.Equal(property, constant);
        var lambda = Expression.Lambda<Func<T, bool>>(equality, parameter);

        return await _dbContext.Set<T>().AnyAsync(lambda);
    }


    public async Task<bool> IsExistsForUpdate<Tid>(Tid id, string key, string value)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.Property(parameter, key);
        var constant = Expression.Constant(value);
        var equality = Expression.Equal(property, constant);
        var idProperty = Expression.Property(parameter, "Id");
        var idEquality = Expression.NotEqual(idProperty, Expression.Constant(id));
        var combinedExpression = Expression.AndAlso(equality, idEquality);
        var lambda = Expression.Lambda<Func<T, bool>>(combinedExpression, parameter);
        return await _dbContext.Set<T>().AnyAsync(lambda);
    }


    public virtual async Task<T> Create(T model)
    {
        await _dbContext.Set<T>().AddAsync(model);
        await _dbContext.SaveChangesAsync();
        return model;
    }

    public virtual async Task CreateRange(List<T> model)
    {
        await _dbContext.Set<T>().AddRangeAsync(model);
        await _dbContext.SaveChangesAsync();
    }

    public virtual async Task Update(T model)
    {
        _dbContext.Set<T>().Update(model);
        await _dbContext.SaveChangesAsync();
    }

    public virtual async Task Delete(T model)
    {
        _dbContext.Set<T>().Remove(model);
        await _dbContext.SaveChangesAsync();
    }

    public async Task SaveChangeAsync()
    {
        await _dbContext.SaveChangesAsync();
    }

    public virtual async Task<IEnumerable<T>> GetQuery(QueryParameters query)
    {
        return await _dbContext.Set<T>()
            .Paginate(query.PageNumber, query.PageSize)
            .Sort(query.OrderBy)
            .ToListAsync();
    }

    public async Task<int> CountAsync()
    {
        return await _dbContext.Set<T>().CountAsync();
    }
}