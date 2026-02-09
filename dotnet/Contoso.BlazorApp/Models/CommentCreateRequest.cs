using System.Text.Json.Serialization;

namespace Contoso.BlazorApp.Models;

public sealed class CommentCreateRequest
{
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}
