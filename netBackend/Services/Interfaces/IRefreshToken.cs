using System.Threading.Tasks;

namespace netBackend.Services
{
    public interface IRefreshTokenService
    {
        Task StoreRefreshTokenAsync(string userId, string refreshToken);

        Task<string?> GetRefreshTokenAsync(string userId);

        Task RemoveRefreshTokenAsync(string userId);
    }
}
