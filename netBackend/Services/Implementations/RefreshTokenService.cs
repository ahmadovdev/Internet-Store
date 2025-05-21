using System.Threading.Tasks;
using StackExchange.Redis;
using System;
using netBackend.Configurations;

namespace netBackend.Services.Implementations
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly IDatabase _redisDatabase;
        private readonly TimeSpan _refreshTokenLifetime; 

        public RefreshTokenService(IConnectionMultiplexer redisConnection, JwtSettings jwtSettings) 
        {
            _redisDatabase = redisConnection.GetDatabase();
            _refreshTokenLifetime = TimeSpan.FromDays(jwtSettings.RefreshTokenExpirationDays);
        }

        public async Task StoreRefreshTokenAsync(string userId, string refreshToken)
        {
            await _redisDatabase.StringSetAsync($"refresh_token:{userId}", refreshToken, _refreshTokenLifetime);
        }

        public async Task<string?> GetRefreshTokenAsync(string userId)
        {
            var token = await _redisDatabase.StringGetAsync($"refresh_token:{userId}");
            return token.ToString(); 
        }

        public async Task RemoveRefreshTokenAsync(string userId)
        {
            await _redisDatabase.KeyDeleteAsync($"refresh_token:{userId}");
        }
    }
}
