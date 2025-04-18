using System.Security.Claims;
using BunnyCDN.Net.Storage;
using dotenv.net;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.IdentityModel.Tokens;
using Radzen;
using virtualmuseum.web.api.Components;
using virtualmuseum.web.api.Services;
using virtualmuseum.web.api.Services.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Net.Http.Headers;
using virtualmuseum.web.api;
using virtualmuseum.web.api.Services.Admin;
using virtualmuseum.web.api.Services.ConfigurationRepository;
using virtualmuseum.web.api.Services.DbContext;
using virtualmuseum.web.api.Services.MediaService;
using virtualmuseum.web.api.Services.ReleaseService;

var builder = WebApplication.CreateBuilder(args);

DotEnv.Load();

builder.Configuration
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    var certificateName = Environment.GetEnvironmentVariable("CertificateName");
    var certificatePassword = Environment.GetEnvironmentVariable("CertificatePassword");

    if (string.IsNullOrEmpty(certificatePassword)) certificatePassword = null;
    if (string.IsNullOrEmpty(certificateName))
    {
        throw new Exception("CertificateName environment variable must be set");
    }

    // serverOptions.ListenAnyIP(3000); // HTTP port
    //
    serverOptions.ListenAnyIP(3001, listenOptions =>
    {
        // Path to your PFX file
        listenOptions.UseHttps(certificateName, certificatePassword);
    });
    serverOptions.ListenAnyIP(443, listenOptions =>
    {
        // Path to your PFX file
        listenOptions.UseHttps(certificateName, certificatePassword);
    });
});

builder.Services.Configure<ReleaseServiceConfig>(builder.Configuration.GetSection("ReleaseService"));

builder.Services.AddScoped<IConfigurationRepository, ConfigurationRepository>();

var bunnyStorageConfig = builder.Configuration.GetSection("BunnyStorage").Get<BunnyStorageConfig>();
if(bunnyStorageConfig == null) throw new Exception("BunnyStorage configuration is missing");
var bunnyStorage = new BunnyCDNStorage(bunnyStorageConfig.StorageZoneName, bunnyStorageConfig.ApiAccessKey);
builder.Services.AddSingleton<IBunnyCDNStorage>(bunnyStorage);
builder.Services.AddSingleton<IReleaseService, ReleaseService>();
builder.Services.AddTransient<ICustomRoleService, CustomRoleService>();
builder.Services.AddScoped<IApplicationDbContext, ApplicationDbContext>(); 

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// add httpclient for release service
builder.Services.AddHttpClient<ReleaseService>();

// Add rest controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddRadzenComponents();

var domain = $"https://{builder.Configuration["Auth0:Domain"]}/";

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
    })
    .AddCookie()
    .AddOpenIdConnect(options =>
    {
        options.Authority = $"https://{builder.Configuration["Auth0:Domain"]}";
        options.ClientId = builder.Configuration["Auth0:ClientId"];
        options.ClientSecret = builder.Configuration["Auth0:ClientSecret"];
        options.ResponseType = "code";
        options.Scope.Clear();
        options.Scope.Add("openid");
        options.Scope.Add("profile");
        options.Scope.Add("email");
        options.CallbackPath = new PathString("/callback");
        options.ClaimsIssuer = "Auth0";
        options.SaveTokens = true;
        
        options.Events = new OpenIdConnectEvents
        {
            OnRedirectToIdentityProviderForSignOut = (context) =>
            {
                var logoutUri =
                    $"https://{builder.Configuration["Auth0:Domain"]}/v2/logout?client_id={builder.Configuration["Auth0:ClientId"]}";

                var postLogoutUri = context.Properties.RedirectUri;
                if (!string.IsNullOrEmpty(postLogoutUri))
                {
                    if (postLogoutUri.StartsWith("/"))
                    {
                        var request = context.Request;
                        postLogoutUri = request.Scheme + "://" + request.Host + request.PathBase + postLogoutUri;
                    }

                    logoutUri += $"&returnTo={Uri.EscapeDataString(postLogoutUri)}";
                }

                context.Response.Redirect(logoutUri);
                context.HandleResponse();

                return Task.CompletedTask;
            }
        };
    })
    .AddJwtBearer(options =>
    {
        options.Authority = domain;
        options.Audience = builder.Configuration["Auth0:Audience"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = ClaimTypes.NameIdentifier
        };
    });


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Administrator", policy => policy.RequireClaim(ClaimTypes.Role, "Administrator"));

});


builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AuthenticationStateProvider, CustomAuthenticationStateProvider>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
var databasePath = Environment.GetEnvironmentVariable("DatabasePath");
var connectionString = $"Data Source={databasePath}";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
var mediaPath = Environment.GetEnvironmentVariable("MediaPath") ?? throw new Exception("MediaPath environment variable is not set");

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(mediaPath),
    RequestPath = "/api/media/file",
    ServeUnknownFileTypes = true,
    
    DefaultContentType = "application/octet-stream",
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append(
            HeaderNames.CacheControl, $"public, max-age=3600");
        ctx.Context.Response.Headers.Append(
            HeaderNames.AccessControlAllowHeaders, $"Server, x-goog-meta-frames, Content-Length, Content-Type, Range, X-Requested-With, If-Modified-Since, If-None-Match");
        ctx.Context.Response.Headers.Append(
            HeaderNames.AccessControlExposeHeaders, $"Server, x-goog-meta-frames, Content-Length, Content-Type, Range, X-Requested-With, If-Modified-Since, If-None-Match");
        ctx.Context.Response.Headers.Append(
            HeaderNames.AccessControlAllowOrigin, $"*");
    }
});

app.MapControllers();

// add swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app
    .MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.UseAntiforgery();

app.Run();