using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
  public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>();
            CreateMap<AppUser, UserDto>();
            CreateMap<AppUser, FlatMemberDto>();
            CreateMap<AppUser, UserWithFollowsDto>();
            CreateMap<AppUser, MinimalUserDto>();
            CreateMap<Post, PostDto>();
            CreateMap<Post, SinglePostDto>();
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
        }
    }
}
