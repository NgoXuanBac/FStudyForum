using System.Linq.Dynamic.Core;
using System.Reflection;

using System.Text;

namespace FStudyForum.Core.Helpers;

public static class IQueryableExtension
{
    public static IQueryable<T> Paginate<T>(this IQueryable<T> models, int pageNumber, int pageSize)
    {
        var data = models
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize);
        return data;
    }

    public static IQueryable<T> Sort<T>(this IQueryable<T> models, string orderBy)
    {
        if (!models.Any()) return models;
        if (string.IsNullOrWhiteSpace(orderBy)) return models;
        var @params = orderBy.Trim().Split(",");
        var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var builder = new StringBuilder();
        foreach (var param in @params)
        {
            if (string.IsNullOrWhiteSpace(param)) continue;
            var propertyFromQueryName = param.Split("_")[0];
            var property = properties.FirstOrDefault(pi => pi.Name.Equals(propertyFromQueryName, StringComparison.InvariantCultureIgnoreCase));
            if (property == null) continue;
            var sortingOrder = param.EndsWith("_desc") ? "descending" : "ascending";
            builder.Append($"{property.Name.ToString()} {sortingOrder}, ");
        }

        return models.OrderBy(builder.ToString().TrimEnd(',', ' '));
    }
}
