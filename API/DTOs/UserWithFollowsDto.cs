namespace API.DTOs
{
  public class UserWithFollowsDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        // public int Age { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string ProfilePicUrl { get; set; }
        public HashSet<MinimalUserDto> IsFollowing { get; set; }

        // public List<PostDto> Posts { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
