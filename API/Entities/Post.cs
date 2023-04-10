namespace API.Entities
{
  public class Post
  {
    public int Id { get; set; }
    public List<Photo> Photos { get; set; } = new();
    public string Caption { get; set; }
    // public List<Like> Likes { get; set; } = new();
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
  }
}
