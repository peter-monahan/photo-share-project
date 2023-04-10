using API.Data;
using API.DTOs;
using API.Entities;
using API.Exstensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class PostsController : BaseApiController
    {
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly DataContext _context;
        public PostsController(DataContext context, IPostRepository postRepository, IMapper mapper, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
            _postRepository = postRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SinglePostDto>>> GetPosts()
        {
            var posts = await _postRepository.GetPostsAsync();

            return Ok(posts);
        }

        [HttpGet("followed")]
        public async Task<ActionResult<IEnumerable<SinglePostDto>>> GetFollowedPosts()
        {
            var user = await _userRepository.GetUserByUsernameWithFollowingAsync(User.GetUsername());

            var posts = await _postRepository.GetFollowedPostsAsync(user);

            return Ok(posts);
        }

        [HttpPost]
        public async Task<ActionResult<PostDto>> CreatePost(CreatePostDto createPostDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if(user == null) return NotFound();

            var Post = new Post
            {
                Caption = createPostDto.Caption
            };
            foreach (var photo in createPostDto.Photos)
            {
                var Photo = await _context.Photos.FindAsync(photo.Id);
                Post.Photos.Add(Photo);
            }
            user.Posts.Add(Post);

            if( await _context.SaveChangesAsync() > 0)
            {
                return Ok();
            }

            return BadRequest("We were unable to save your post");
        }
    }
}
