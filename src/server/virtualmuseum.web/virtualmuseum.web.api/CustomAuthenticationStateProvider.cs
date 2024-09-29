using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;
using virtualmuseum.web.api.Services.Admin;

namespace virtualmuseum.web.api;

public class CustomAuthenticationStateProvider : AuthenticationStateProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserRoleService _userRoleService;

    public CustomAuthenticationStateProvider(IHttpContextAccessor httpContextAccessor, IUserRoleService userRoleService)
    {
        _httpContextAccessor = httpContextAccessor;
        _userRoleService = userRoleService;
    }

    public override async Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        var user = _httpContextAccessor.HttpContext?.User;

        if (user?.Identity?.IsAuthenticated == true)
        {
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = user.FindFirst("name")?.Value ?? user.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";

            if (!string.IsNullOrEmpty(userId))
            {
                await _userRoleService.AddUserRoleAsync(userId, username);
                var userRole = await _userRoleService.GetUserRoleByIdAsync(userId);
                var identity = new ClaimsIdentity(user.Claims.Where( c=>c.Type!=ClaimTypes.Role), "Auth0");
                identity.AddClaim(new Claim(ClaimTypes.Role, userRole.Role));
                user = new ClaimsPrincipal(identity);
                _httpContextAccessor.HttpContext!.User = user;
            }
        }

        return new AuthenticationState(user ?? new ClaimsPrincipal(new ClaimsIdentity()));
    }

    public string GetUsername()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        return user?.FindFirst("name")?.Value ?? "Unbekannt";
    }
    public string GetRole()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        return user?.FindFirst(ClaimTypes.Role)?.Value ?? "Unbekannt";
    }
}