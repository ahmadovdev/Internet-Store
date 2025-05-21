
using MongoDB.Driver;
using System.Threading.Tasks;
using netBackend.Models;
using netBackend.Dtos;
using BCrypt.Net;
using System;

namespace netBackend.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserService(IMongoDatabase database)
        {
            _usersCollection = database.GetCollection<User>("users");
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _usersCollection.Find(user => user.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await _usersCollection.Find(user => user.Id == userId).FirstOrDefaultAsync();
        }

        public async Task<User> CreateUserAsync(RegisterRequestDto request)
        {
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "customer",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _usersCollection.InsertOneAsync(user);

            return user;
        }

        public Task<bool> CheckPasswordAsync(User user, string password)
        {
            return Task.FromResult(BCrypt.Net.BCrypt.Verify(password, user.Password));
        }
    }
}
