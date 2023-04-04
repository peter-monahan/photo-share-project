namespace API.DTOs
{
  public class PostDto
  {
    public int Id { get; set; }
    public List<PhotoDto> Photos { get; set; }
    public string Caption { get; set; }
    // public List<Like> Likes { get; set; } = new();
    public int AppUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
  }
}
