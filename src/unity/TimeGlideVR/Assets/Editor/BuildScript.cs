using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using TimeGlideVR.Server.Editor;
using UnityEditor;
using UnityEngine;

namespace Editor
{
    public class BuildScript
    {
        // Default environments to build if none are specified
        private static readonly string[] DefaultEnvironments = new string[] 
        { 
            "Default", 
            "Wilhelmsburg" 
        };

        // Command line build method that accepts a list of environments
        public static void CommandLineBuild()
        {
            // Parse command line arguments
            var args = ParseCommandLineArgs();

            // Get environments from command line or use defaults
            var environments = GetEnvironmentsFromArgs(args);
            
            // Build for each environment
            foreach (var env in environments)
            {
                BuildAndroid(env);
            }
        }

        // Parse command line arguments into a dictionary
        private static Dictionary<string, string> ParseCommandLineArgs()
        {
            var args = new Dictionary<string, string>();
            var commandLineArgs = Environment.GetCommandLineArgs();

            for (var i = 0; i < commandLineArgs.Length; i++)
            {
                if (commandLineArgs[i].StartsWith("-"))
                {
                    var key = commandLineArgs[i].Substring(1);
                    var value = "";

                    if (i + 1 < commandLineArgs.Length && !commandLineArgs[i + 1].StartsWith("-"))
                    {
                        value = commandLineArgs[i + 1];
                        i++;
                    }

                    args[key] = value;
                }
            }

            return args;
        }

        // Get environments from command line arguments or use defaults
        private static string[] GetEnvironmentsFromArgs(Dictionary<string, string> args)
        {
            if (args.TryGetValue("environments", out var environmentsArg))
            {
                return environmentsArg.Split(',');
            }
            else if (args.TryGetValue("environment", out var environmentArg))
            {
                return new string[] { environmentArg };
            }
            
            return DefaultEnvironments;
        }

        // Build for a specific environment
        public static void BuildAndroid(string environmentName)
        {
            Debug.Log($"Building for environment: {environmentName}");

            // Set the environment in the EnvironmentSettings.cs file
            var environmentSetter = new BuildEnvironmentSetter();
            environmentSetter.SetEnvironmentForBuild(environmentName);

            // Define build path
            var buildPath = Path.Combine("build", "Android", $"TimeGlideVR_{environmentName}.apk");
            
            // Create the directory if it doesn't exist
            Directory.CreateDirectory(Path.GetDirectoryName(buildPath));

            // Define build options
            var buildPlayerOptions = new BuildPlayerOptions
            {
                scenes = EditorBuildSettings.scenes.Select(s => s.path).ToArray(),
                locationPathName = buildPath,
                target = BuildTarget.Android,
                options = BuildOptions.None
            };

            // Build the player
            BuildPipeline.BuildPlayer(buildPlayerOptions);
            
            Debug.Log($"Build completed for environment: {environmentName}");
        }
    }
}
