using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
  public class CreatePostDto
    {
        [Required]
        public string Caption { get; set; }
        [Required]
        [MinLength(1)]
        [MaxLength(15)]
        public PhotoDto[] Photos { get; set; }
    }
}
