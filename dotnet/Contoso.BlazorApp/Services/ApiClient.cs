using System.Net.Http.Json;
using Contoso.BlazorApp.Models;

namespace Contoso.BlazorApp.Services;

public sealed class ApiClient
{
    private readonly HttpClient _httpClient;

    public ApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<Post>> GetPostsAsync(CancellationToken cancellationToken = default)
    {
        return await _httpClient.GetFromJsonAsync<List<Post>>("posts", cancellationToken)
            ?? new List<Post>();
    }

    public async Task<Post?> GetPostAsync(string postId, CancellationToken cancellationToken = default)
    {
        return await _httpClient.GetFromJsonAsync<Post>($"posts/{postId}", cancellationToken);
    }

    public async Task<List<Comment>> GetCommentsAsync(string postId, CancellationToken cancellationToken = default)
    {
        return await _httpClient.GetFromJsonAsync<List<Comment>>($"posts/{postId}/comments", cancellationToken)
            ?? new List<Comment>();
    }

    public async Task<Post?> CreatePostAsync(PostCreateRequest request, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.PostAsJsonAsync("posts", request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        return await response.Content.ReadFromJsonAsync<Post>(cancellationToken: cancellationToken);
    }

    public async Task<bool> CreateCommentAsync(string postId, CommentCreateRequest request, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.PostAsJsonAsync($"posts/{postId}/comments", request, cancellationToken);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> IsApiAvailableAsync(CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetAsync("openapi.yaml", cancellationToken);
        return response.IsSuccessStatusCode;
    }
}
