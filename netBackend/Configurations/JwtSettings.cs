
namespace netBackend.Configurations
{
    public class JwtSettings
    {
        public string Secret { get; set; } = string.Empty;
        public int ExpirationMinutes { get; set; }
        public int RefreshTokenExpirationDays { get; set; } 
    }
}
