using System.Text.Json.Serialization;

namespace Contoso.BlazorApp.Models;

public sealed class LikeRequest
{
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;
}
