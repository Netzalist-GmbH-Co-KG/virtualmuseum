public class UserRole
{
    public int Id { get; set; }
    public string UserId { get; set; } // Auth0 User ID
    public string Username { get; set; }
    public string Role { get; set; } // "Unauthorized", "Contributor", oder "Administrator"
}
