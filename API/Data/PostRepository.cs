using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PostRepository : IPostRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PostRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

    public async Task<IEnumerable<SinglePostDto>> GetFollowedPostsAsync(AppUser user)
    {
        return await _context.Posts
                .Where(p => user.IsFollowing.Contains(p.AppUser) )
                .OrderByDescending(p => p.CreatedAt)
                // .Take(10)
                .ProjectTo<SinglePostDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
    }

    public async Task<IEnumerable<SinglePostDto>> GetFollowedPostsAsync(AppUser user, int afterId)
    {
        return await _context.Posts
                .ProjectTo<SinglePostDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(p => p.Id)
                .Take(10)
                .ToListAsync();
    }

    public async Task<IEnumerable<SinglePostDto>> GetFollowedPostsAsync(AppUser user, int afterId, int count)
    {
        return await _context.Posts
                .ProjectTo<SinglePostDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(p => p.Id)
                .Take(count)
                .ToListAsync();
    }

    public async Task<IEnumerable<SinglePostDto>> GetPostsAsync()
        {
            return await _context.Posts
                .ProjectTo<SinglePostDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(p => p.Id)
                .Take(10)
                .ToListAsync();

        }
                public async Task<IEnumerable<SinglePostDto>> GetPostsAsync(int afterId)
        {
            return await _context.Posts
                .ProjectTo<SinglePostDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(p => p.Id)
                .Where(p => p.Id < afterId)
                .Take(10)
                .ToListAsync();

        }

    public async Task<IEnumerable<SinglePostDto>> GetPostsAsync(int afterId, int count)
    {
                  return await _context.Posts
                .ProjectTo<SinglePostDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(p => p.Id)
                .Where(p => p.Id < afterId)
                .Take(count)
                .ToListAsync();

    }

    public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
