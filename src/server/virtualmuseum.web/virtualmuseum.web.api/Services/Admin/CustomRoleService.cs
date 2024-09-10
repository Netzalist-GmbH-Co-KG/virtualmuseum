using System.Security.Claims;

namespace virtualmuseum.web.api.Services;

public class CustomRoleService : ICustomRoleService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserRoleService _userRoleService;

    public CustomRoleService(IHttpContextAccessor httpContextAccessor, IUserRoleService userRoleService)
    {
        _httpContextAccessor = httpContextAccessor;
        _userRoleService = userRoleService;
    }
    
    public bool HasRole(string role)
    {
        
        return _httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true 
               && _userRoleService.GetUserRoleByIdAsync(_httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value).Result.Role == role;
    }

    public string[] Roles
    {
        get
        {
            var ctx = _httpContextAccessor.HttpContext;
            if (ctx == null)
            {
                return Array.Empty<string>();
            }

            return
            [
                _userRoleService
                    .GetUserRoleByIdAsync(_httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)
                        ?.Value).Result.Role
            ];
        }
    } 
}