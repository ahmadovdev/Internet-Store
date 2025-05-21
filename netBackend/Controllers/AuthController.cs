using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using netBackend.Dtos;
using netBackend.Services;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System;

namespace netBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;
        private readonly IRefreshTokenService _refreshTokenService;

        public AuthController(IUserService userService, ITokenService tokenService, IRefreshTokenService refreshTokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
            _refreshTokenService = refreshTokenService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] RegisterRequestDto request)
        {
            try
            {
                var userExists = await _userService.GetUserByEmailAsync(request.Email);

                if (userExists != null)
                {
                    return BadRequest(new { message = "User already exists" });
                }

                var user = await _userService.CreateUserAsync(request);

                var tokens = _tokenService.GenerateTokens(user.Id.ToString());
                await _refreshTokenService.StoreRefreshTokenAsync(user.Id.ToString(), tokens.RefreshToken);

                SetAuthCookies(tokens.AccessToken, tokens.RefreshToken);

                return StatusCode(201, new
                {
                    _id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var user = await _userService.GetUserByEmailAsync(request.Email);

                if (user == null || !await _userService.CheckPasswordAsync(user, request.Password))
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                var tokens = _tokenService.GenerateTokens(user.Id.ToString());
                await _refreshTokenService.StoreRefreshTokenAsync(user.Id.ToString(), tokens.RefreshToken);

                SetAuthCookies(tokens.AccessToken, tokens.RefreshToken);

                return Ok(new
                {
                    _id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];
                if (!string.IsNullOrEmpty(refreshToken))
                {
                    var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
                    if (userIdClaim != null)
                    {
                         await _refreshTokenService.RemoveRefreshTokenAsync(userIdClaim.Value);
                    }
                }

                ClearAuthCookies();

                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];

                if (string.IsNullOrEmpty(refreshToken))
                {
                    return Unauthorized(new { message = "No refresh token provided" });
                }

                var principal = _tokenService.GetPrincipalFromExpiredToken(refreshToken);
                if (principal == null)
                {
                     return Unauthorized(new { message = "Invalid refresh token" });
                }

                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                 if (string.IsNullOrEmpty(userId))
                {
                     return Unauthorized(new { message = "Invalid refresh token" });
                }

                var storedToken = await _refreshTokenService.GetRefreshTokenAsync(userId);

                if (storedToken != refreshToken)
                {
                    await _refreshTokenService.RemoveRefreshTokenAsync(userId);
                    return Unauthorized(new { message = "Invalid refresh token" });
                }

                var newAccessToken = _tokenService.GenerateAccessToken(userId);

                SetAuthCookies(newAccessToken, refreshToken);

                return Ok(new { message = "Token refreshed successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _userService.GetUserByIdAsync(userIdClaim.Value);
                 if (user == null)
                {
                     return NotFound(new { message = "User not found" });
                }

                return Ok(new
                {
                    _id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        private void SetAuthCookies(string accessToken, string refreshToken)
        {
            var accessTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = HttpContext.Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(15)
            };
            Response.Cookies.Append("accessToken", accessToken, accessTokenOptions);

            var refreshTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = HttpContext.Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", refreshToken, refreshTokenOptions);
        }

        private void ClearAuthCookies()
        {
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");
        }
    }
}
