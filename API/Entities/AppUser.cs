
using API.Exstensions;
using Microsoft.EntityFrameworkCore;

namespace API.Entities
{
  [Index(nameof(UserName), IsUnique = true)]
  public class AppUser
    {
        public int Id { get; set; }
        public bool IsSeedUser { get; set; } = false;
        public string UserName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PaswordSalt { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string ProfilePicUrl { get; set; } = "./assets/user.png";
        public string PublicId { get; set; }
        public List<Post> Posts { get; set; } = new();
        public List<Photo> Photos { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public HashSet<AppUser> IsFollowedBy { get; set; } = new();
        public HashSet<AppUser> IsFollowing { get; set; } = new();

        public int GetAge()
        {
          return DateOfBirth.CalculateAge();
        }
    }
}
