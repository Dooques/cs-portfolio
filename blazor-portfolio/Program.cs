using System.Buffers.Text;
using blazor_portfolio.Components;
using Blazorise;
using Blazorise.Bootstrap5;
using Blazorise.Icons.FontAwesome;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

builder.Configuration.AddJsonFile(
    "secretSettings.json", optional: true, reloadOnChange: true);


// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents(options =>
    {
        options.DetailedErrors = true;
    });

builder.Services.AddBlazorise(options =>
    {
        options.Immediate = true;
        if (builder.Environment.IsProduction())
        { 
            options.ProductToken = Environment.GetEnvironmentVariable("BLAZORKEY")?.Trim();
        }
    })
    .AddBootstrap5Providers()
    .AddFontAwesomeIcons();

var hc = builder.Services.AddHealthChecks();

builder.Services.AddHttpClient("Client",client =>
    client.BaseAddress = new Uri("https://localhost:5281"));

hc.AddCheck(
    name: "self-live",
    check: () => HealthCheckResult.Healthy("Application is healthy"),
    tags: ["health"]);

hc.AddCheck(
    name: "self-ready",
    check: () => HealthCheckResult.Healthy("Application is ready to serve requests"),
    tags: ["ready"]);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHealthChecks("/health", new HealthCheckOptions
{
    AllowCachingResponses = false,
    Predicate = r => r.Tags.Contains("health")
});

app.UseHealthChecks("/ready", new HealthCheckOptions
{
    AllowCachingResponses = false,
    Predicate = r => r.Tags.Contains("ready")
});

// app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();