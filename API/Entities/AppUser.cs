
using API.Exstensions;

namespace API.Entities
{
  public class AppUser
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PaswordSalt { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string ProfilePicUrl { get; set; }
        public string PublicId { get; set; }
        public List<Post> Posts { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public int GetAge()
        {
          return DateOfBirth.CalculateAge();
        }
    }
}
