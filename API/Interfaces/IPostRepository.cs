using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IPostRepository
    {
        Task<bool> SaveAllAsync();
        Task<IEnumerable<SinglePostDto>> GetPostsAsync();
        Task<IEnumerable<SinglePostDto>> GetPostsAsync(int afterId);
        Task<IEnumerable<SinglePostDto>> GetPostsAsync(int afterId, int count);
        Task<IEnumerable<SinglePostDto>> GetFollowedPostsAsync(AppUser user);
        Task<IEnumerable<SinglePostDto>> GetFollowedPostsAsync(AppUser user, int afterId);
        Task<IEnumerable<SinglePostDto>> GetFollowedPostsAsync(AppUser user, int afterId, int count);


    }
}
