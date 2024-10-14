using System;
using System.Linq;
using TimeGlideVR.MultiMediaPresentation;
using TimeGlideVR.Server;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace TimeGlideVR.DevScenes
{
    public class MultiMediaPresentationTests : MonoBehaviour
    {
        [SerializeField]
        private TextMeshProUGUI logText;

        [SerializeField] 
        private Button testButton;
    
    
        [SerializeField]
        private MultiMediaPresentationPlayer multiMediaPresentationPlayer;
    
        [SerializeField]
        private ConfigurationManager configurationManager;
    
    
        // Start is called before the first frame update
        void Start()
        {
            testButton.onClick.AddListener(TestButtonClicked);
        }
    
        private async void TestButtonClicked()
        {
            try
            {
                Log("TestButtonClicked");
                var tenants = await configurationManager.ConfigurationClient.GetTenants();
                Log($"Found {tenants.Count} tenants");
                var tableId = tenants[0].Rooms[0].InventoryItems[0].Id;
                var topographicalTable = await configurationManager.ConfigurationClient.GetTopographicalTableConfiguration(tableId);

                var presentations = topographicalTable.Topics
                    .SelectMany(t => t.TimeSeries
                        .SelectMany(ts => ts.GeoEventGroups
                            .SelectMany(geg => geg.GeoEvents
                                .Select(ge => ge.MultiMediaPresentation))))
                    .ToList();
                foreach(var p in presentations){
                    Log("Presentation: " + p.Name);
                }
                Log($"Found {presentations.Count} presentations");
            
                var presentationsWithMedia = presentations
                    .Where(p => p.PresentationItems.Any())
                    .ToList();
            
                Log($"Found {presentationsWithMedia.Count} presentations with media");
            
                var presentationWithMostMedia = presentationsWithMedia
                    .OrderByDescending(p => p.PresentationItems.Count)
                    .FirstOrDefault();


                var testPresentation = presentations.FirstOrDefault(p => p.Name == "Meiningen");
                if (presentationWithMostMedia != null)
                {
                    Log($"Playing presentation: {testPresentation.Name} with {testPresentation.PresentationItems.Count} items");
                }
            
                multiMediaPresentationPlayer.Init(testPresentation);
                multiMediaPresentationPlayer.StartPresentation();
            }
            catch (Exception e)
            {
                Log($"Error: {e.Message}");
            }

        }
    
        private void Log(string message)
        {
            logText.text += "\n" + message;
        }
    }
}
