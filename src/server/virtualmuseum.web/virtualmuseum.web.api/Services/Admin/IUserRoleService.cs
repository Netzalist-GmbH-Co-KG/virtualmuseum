using Microsoft.EntityFrameworkCore;
using virtualmuseum.web.api.Services.DbContext;

namespace virtualmuseum.web.api.Services.Admin
{
    public interface IUserRoleService
    {
        Task<string> GetUserRoleAsync(string userId);
        Task SetUserRoleAsync(string userId, string role);
        Task<List<UserRole>> GetAllUserRolesAsync();
        Task AddUserRoleAsync(string userId, string username);
        Task<UserRole> GetUserRoleByIdAsync(string userId);
    }

    public class UserRoleService : IUserRoleService
    {
        private readonly ApplicationDbContext _context;

        public UserRoleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> GetUserRoleAsync(string userId)
        {
            var userRole = await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == userId);
            return userRole?.Role ?? "Unauthorized";
        }

        public async Task SetUserRoleAsync(string userId, string role)
        {
            var userRole = await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == userId);
            if (userRole == null)
            {
                throw new InvalidOperationException("User not found");
            }
            userRole.Role = role;
            await _context.SaveChangesAsync();
        }

        public async Task<List<UserRole>> GetAllUserRolesAsync()
        {
            return await _context.UserRoles.ToListAsync();
        }

        public async Task AddUserRoleAsync(string userId, string username)
        {
            var existingUserRole = await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == userId);
            if (existingUserRole == null)
            {
                var newUserRole = new UserRole { UserId = userId, Username = username, Role = "Unauthorized" };
                _context.UserRoles.Add(newUserRole);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<UserRole> GetUserRoleByIdAsync(string userId)
        {
            return await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == userId);
        }
    }
}
