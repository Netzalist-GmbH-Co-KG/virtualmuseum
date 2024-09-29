namespace virtualmuseum.web.api.Services.Admin;

public interface ICustomRoleService
{
    bool HasRole(string role);
    string[] Roles { get; }
}