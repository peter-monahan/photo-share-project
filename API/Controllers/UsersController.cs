using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Exstensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();

            return Ok(users);
        }

        [HttpGet("current")]
        public async Task<ActionResult<UserWithFollowsDto>> GetCurrentUser()
        {
            var user = await _userRepository.GetUserByUsernameWithFollowingAsync(User.GetUsername());

            if(user == null) return NotFound();

            return _mapper.Map<UserWithFollowsDto>(user);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {

            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if(user == null) return NotFound();

            _mapper.Map(memberUpdateDto, user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPost("photos")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync()) {
                return CreatedAtAction(nameof(GetUser), new {username = user.UserName}, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Problem adding photo");
        }

        [HttpDelete("photos/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();
            if (photo.PublicId == null) return BadRequest("You cannot delete a seeded photo");

            var result = await _photoService.DeletePhotoAsync(photo.PublicId);
            if(result.Error != null) return BadRequest(result.Error.Message);

            user.Photos.Remove(photo);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Was unable to delete photo record");

        }

        [HttpPost("follow/{userId}")]
        public async Task<ActionResult> FollowUser(int userId)
        {
            var user = await _userRepository.GetUserByUsernameWithFollowingAsync(User.GetUsername());

            if (user == null) return NotFound("Could not find the signed in user, try logging out and back in");
            if (userId == user.Id) return BadRequest("You cannot follow yourself");
            if (user.IsFollowing.FirstOrDefault(u => u.Id == userId) != null) return BadRequest("Cannot follow an already followed user");

            var otherUser = await _userRepository.GetUserByIdAsync(userId);
            if (otherUser == null) return NotFound("Could not find the user to follow");
            user.IsFollowing.Add(otherUser);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Was unable to follow user");

        }

        [HttpDelete("follow/{userId}")]
        public async Task<ActionResult> UnfollowUser(int userId)
        {
            var user = await _userRepository.GetUserByUsernameWithFollowingAsync(User.GetUsername());

            if (user == null) return NotFound("Could not find the signed in user, try logging out and back in");

            var otherUser = user.IsFollowing.FirstOrDefault(u => u.Id == userId);
            if (otherUser == null) return NotFound("Could not find the user to unfollow");

            user.IsFollowing.Remove(otherUser);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Was unable to unfollow user");

        }

        // [HttpDelete("photos/{photoId}")]
        // public async Task<ActionResult> DeletePhoto(int photoId)
        // {
        //     var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        //     if (user == null) return NotFound();

        //     var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

        //     if (photo == null) return NotFound();
        //     if (photo.PublicId == null) return BadRequest("You cannot delete a seeded photo");

        //     var result = await _photoService.DeletePhotoAsync(photo.PublicId);
        //     if(result.Error != null) return BadRequest(result.Error.Message);

        //     user.Photos.Remove(photo);

        //     if(await _userRepository.SaveAllAsync()) return Ok();

        //     return BadRequest("Was unable to delete photo record");

        // }

    }
}
