using Microsoft.AspNetCore.Identity;

namespace FStudyForum.Core.Exceptions;

public class ValidationException : Exception
{
    public ValidationException()
            : base("One or more validation failures have occurred.")
    {
        Errors = new Dictionary<string, string[]>();
    }
    public ValidationException(IEnumerable<IdentityError> errors) : this()
    {
        Errors = errors
            .GroupBy(e => e.Code, e => e.Description)
            .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());
    }

    public IDictionary<string, string[]> Errors { get; }
}

