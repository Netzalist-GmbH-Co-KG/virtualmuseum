﻿namespace virtualmuseum.web.api.Services;

public interface ICustomRoleService
{
    bool HasRole(string role);
    string[] Roles { get; }
}