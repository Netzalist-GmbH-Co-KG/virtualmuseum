# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and all projects
COPY ./virtualmuseum.web.sln .
COPY ./BunnyCDN.Net.Storage ./BunnyCDN.Net.Storage
COPY ./virtualmuseum.web.data ./virtualmuseum.web.data
COPY ./virtualmuseum.web.api ./virtualmuseum.web.api

WORKDIR /src/virtualmuseum.web.api

# Restore and publish
RUN dotnet restore ../virtualmuseum.web.sln
RUN dotnet publish virtualmuseum.web.api.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 3001
EXPOSE 443
# EXPOSE 3000
ENTRYPOINT ["dotnet", "virtualmuseum.web.api.dll"]