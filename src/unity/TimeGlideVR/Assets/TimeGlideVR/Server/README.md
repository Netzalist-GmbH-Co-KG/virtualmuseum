# TimeGlideVR Customer Environment Configuration System

This system allows the TimeGlideVR application to be configured for different customer environments with different server URLs. Each customer has their own dedicated server URL configuration.

## Overview

The environment configuration system uses a simple, static approach:

1. **Static configuration file**: All customer environments are defined in a single `EnvironmentSettings.cs` file.
2. **Build-time configuration**: The active environment is set during the build process by modifying the `CurrentEnvironmentName` constant.
3. **Runtime configuration**: The app can optionally load an environment name from a text file for testing purposes.

## How It Works

### Environment Settings File

All customer environments are defined in the `EnvironmentSettings.cs` file. This is a static class with:

1. A constant `CurrentEnvironmentName` that determines which environment is active
2. A dictionary of all available environments with their respective API URLs and tokens

```csharp
public static class EnvironmentSettings
{
    // This is the only value that will be modified by the build pipeline
    public const string CurrentEnvironmentName = "Default";
    
    // Add all your customer environments here
    public static readonly Dictionary<string, CustomerEnvironmentConfig> Environments = new Dictionary<string, CustomerEnvironmentConfig>
    {
        { "Default", new CustomerEnvironmentConfig { ApiUrl = "http://default-server.com/api/" } },
        { "Customer1", new CustomerEnvironmentConfig { ApiUrl = "http://customer1.example.com/api/" } },
        // Add more customers as needed
    };
}
```

### Building for Different Environments

#### From Command Line
```
Unity.exe -batchmode -quit -executeMethod TimeGlideVR.Editor.BuildScript.CommandLineBuild -environment "Customer1"
```
Replace `Customer1` with the name of the customer environment you want to build for.

#### In CI/CD Pipeline
The GitHub workflow is configured to build for multiple customer environments. To add more customers to the CI/CD pipeline, edit the `.github/workflows/main.yml` file and add additional build and upload steps for each new customer environment.

## Runtime Environment Switching

For testing purposes, the app will check for a file named `environment.txt` in the application's persistent data path. If found, it will read the customer environment name from this file and override the compiled setting.

To create this file on a Meta Quest device:
1. Connect the device to a computer
2. Navigate to the app's persistent data folder
3. Create a file named `environment.txt` containing the customer name (e.g., `Customer1`)

This is useful for testing different customer configurations on the same device without rebuilding the app.

## Adding a New Customer Environment

1. Open the `EnvironmentSettings.cs` file
2. Add a new entry to the `Environments` dictionary:
   ```csharp
   { "NewCustomer", new CustomerEnvironmentConfig 
       { 
           ApiUrl = "http://newcustomer.example.com/api/",
           ApiToken = "newcustomer-token" 
       }
   },
   ```
3. To include this customer in the CI/CD pipeline, update the `.github/workflows/main.yml` file

## Technical Details

- The `ConfigurationManager` loads the appropriate server URL based on the current customer environment name
- The environment is set during the build process by modifying the `CurrentEnvironmentName` constant
- The build system uses regex to update only the environment name without changing the rest of the file
- No prefab modifications or complex editor scripts are needed

## Troubleshooting

If the app is connecting to the wrong server:
1. Check the logs for the line: `Initializing with environment: [Environment Name], URL: [URL]`
2. Verify that the environment name exists in the `Environments` dictionary in `EnvironmentSettings.cs`
3. For runtime switching, ensure the `environment.txt` file contains a valid customer environment name
4. If building from the command line, verify the `-environment` parameter matches one of your defined customer names
