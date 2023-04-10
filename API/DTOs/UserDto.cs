namespace API.DTOs
{
    public class UserDto
    {
        public string Username { get; set; }
        public string ProfilePicUrl { get; set; }
        // public HashSet<MinimalUserDto> IsFollowing { get; set; }
        public string Token { get; set; }
    }
}
