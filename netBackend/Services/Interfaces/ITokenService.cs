using System.Security.Claims;
using netBackend.Dtos;

namespace netBackend.Services
{
    public interface ITokenService
    {
        TokenResponseDto GenerateTokens(string userId);

        string GenerateAccessToken(string userId);

        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}
