using System.Threading.Tasks;
using netBackend.Models;
using netBackend.Dtos;

namespace netBackend.Services
{
    public interface IUserService
    {
        Task<User?> GetUserByEmailAsync(string email);

        Task<User?> GetUserByIdAsync(string userId);

        Task<User> CreateUserAsync(RegisterRequestDto request);

        Task<bool> CheckPasswordAsync(User user, string password);
    }
}
