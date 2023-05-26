using System.Net.Http.Headers;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    public class AccountController : BaseApiController
    {

        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _tokenService = tokenService;
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("register")]// POST api/account/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

           using var hmac = new HMACSHA512();

           var user = new AppUser
           {
            DisplayName = registerDto.Username,
            UserName = registerDto.Username.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PaswordSalt = hmac.Key
           };

           _context.Users.Add(user);
           await _context.SaveChangesAsync();
           return new UserDto
           {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user),
            ProfilePicUrl = user.ProfilePicUrl
           };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(user => user.UserName == loginDto.Username);

            if (user == null) return Unauthorized("Invalid username");
            if (loginDto.Password == null) return Unauthorized("Must provide a password");
            if (user.PasswordHash == null) return Unauthorized("This user does not have a password and must be logged in using Microsoft login");


            using var hmac = new HMACSHA512(user.PaswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for ( int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

           var returnUser = _mapper.Map<UserDto>(user);
           returnUser.Token = _tokenService.CreateToken(user);
           return returnUser;
        }

        [HttpPost("mslogin")]
        public async Task<ActionResult<UserDto>> MsLogin(MsLoginDto msLoginDto)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", msLoginDto.Token);
            var result = httpClient.GetAsync("https://graph.microsoft.com/v1.0/me").Result;
            var infoString = await result.Content.ReadAsStringAsync();
            var info = JsonSerializer.Deserialize<MsUserInfoDto>(infoString);

            var username = info.userPrincipalName;
            if(username == null) return BadRequest("Was unable to verify username from msGraph");
            try
            {
                var emailAddress = new MailAddress(username);
                username = string.Concat(emailAddress.User.Where(c => Char.IsLetterOrDigit(c) || c == '-'));
            }
            catch
            {
                username = string.Concat(username.Where(c => Char.IsLetterOrDigit(c) || c == '-'));
            }

            var user = await _context.Users.FirstOrDefaultAsync(user => user.UserName == username);
            // Console.WriteLine(msLoginDto.Token);
            Console.WriteLine(username);
            if (user != null) {
                if(user.PasswordHash != null) return Unauthorized("A Vistagram user profile already exists with this username. If this is yours please enter your username and password.");
                var returnUser = _mapper.Map<UserDto>(user);
                returnUser.Token = _tokenService.CreateToken(user);
                return returnUser;
            } else {
                using var hmac = new HMACSHA512();
                var newUser = new AppUser
                {
                    DisplayName = username,
                    UserName = username.ToLower(),
                    // PasswordHash = new byte[1],
                    // PaswordSalt = new byte[1],
                    // PublicId = "1234"
                };

                if (await UserExists(username)) return BadRequest("Username is taken");

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                return new UserDto
                {
                    Username = newUser.UserName,
                    Token = _tokenService.CreateToken(newUser),
                    ProfilePicUrl = newUser.ProfilePicUrl
                };
            }



        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(user => user.UserName == username.ToLower());
        }
    }
}
