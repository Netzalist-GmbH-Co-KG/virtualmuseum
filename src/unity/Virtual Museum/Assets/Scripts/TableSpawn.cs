using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UnityEngine;

public class TableSpawn : MonoBehaviour
{
    public static TableSpawn instance;
    
    private const string PlayerPrefsKey = "GuidList";
    
    [SerializeField] private GameObject table;
    [SerializeField] private GameObject anchorPrefab;
    [SerializeField] private OVRCameraRig cameraRig;
    [SerializeField] private GameObject clusterUI;
    private Guid anchorGuid;
    [SerializeField] private string debugGuid;
    private Guid defaultGuid = new Guid();
    private OVRSpatialAnchor anchor;
    private GameObject instantiatedAnchor;
    private List<OVRSpatialAnchor.UnboundAnchor> unboundAnchors;
    private TableGhost tableGhostScript;
    private static readonly int Initiate = Animator.StringToHash("Initiate");

    //testing
    private void Update() {
        if(Input.GetKeyDown(KeyCode.Space)){
            TestPlacetable();
        }
    }

    private void TestPlacetable(){
        var anchorInScene = GameObject.FindWithTag("Anchor");
        if (!anchorInScene)
        {
            Debug.Log("No Spatial Anchor found in the scene!");
            return;
        }

        Instantiate(table, new Vector3(anchorInScene.transform.position.x, 0f, anchorInScene.transform.position.z), Quaternion.Euler(0, anchorInScene.transform.rotation.eulerAngles.y, 0));
        gameObject.SetActive(false);
    }
    //testing

    /* These things shouldnt be called at start anymore. Instead, call them in RoomButton OnClick script and pass the room as a parameter
    private void Start()
    {
        if (instance == null) instance = this;
        tableGhostScript = GetComponent<TableGhost>();
        unboundAnchors = new List<OVRSpatialAnchor.UnboundAnchor>();
        LoadSpatialAnchor();
    }
    */

    private void Awake() {
        if (instance == null) instance = this;
        tableGhostScript = GetComponent<TableGhost>();
        unboundAnchors = new List<OVRSpatialAnchor.UnboundAnchor>();
    }

    public void SpawnTableOnAnchor()
    {
        /*var anchorInScene = GameObject.FindWithTag("Anchor");
        if (!anchorInScene)
        {
            Debug.Log("No Spatial Anchor found in the scene!");
            return;
        }*/

        // var t = Instantiate(table, new Vector3(anchor.transform.position.x, 0f, anchor.transform.position.z), Quaternion.Euler(0, anchor.transform.rotation.eulerAngles.y, 0));
        if (instantiatedAnchor == null)
        {
            Debug.Log("No Spatial Anchor Table found in the scene!");
            return;
        }

        instantiatedAnchor.GetComponent<Animator>().SetBool(Initiate, true);
        instantiatedAnchor.GetComponent<AudioSource>().Play();
        instantiatedAnchor.transform.GetChild(0).gameObject.SetActive(true);
        gameObject.SetActive(false);
    }

    public void CreateSpatialAnchor()
    {
        if (!tableGhostScript.ghost) return;

        if (anchor != null)
        {
            Destroy(anchor.gameObject);
            anchor = null;
        }
        
        instantiatedAnchor = Instantiate(anchorPrefab, tableGhostScript.GetGhostPosition(),
            tableGhostScript.GetGhostRotation());

        var rotation = instantiatedAnchor.transform.rotation;
        
        clusterUI.transform.position = instantiatedAnchor.transform.position + rotation * new Vector3(0f, 0f, -2f);
        
        var eulAngles = rotation.eulerAngles;
        clusterUI.transform.rotation = Quaternion.Euler(0f, eulAngles.y, 0f);
        
        Debug.Log("Initialization process started!");
       StartCoroutine(AnchorCreation(instantiatedAnchor.AddComponent<OVRSpatialAnchor>()));
    }

    public void LoadSpatialAnchor()
    {
        var g = LoadGuid()[0];
        Debug.Log(g);
        anchorGuid = g;
        SetPositionAfterLoad();
    }

    private async void SetPositionAfterLoad()
    {
        await LoadAnchorByUuid(new List<Guid>{anchorGuid});
        StartCoroutine(WaitAndThenSetPositionOfUI());
    }

    private IEnumerator WaitAndThenSetPositionOfUI()
    {
        yield return null;
        var rotation = instantiatedAnchor.transform.rotation;
        
        clusterUI.transform.position = instantiatedAnchor.transform.position + rotation * new Vector3(0f, 0f, -2f);
        var eulAngles = rotation.eulerAngles;
        clusterUI.transform.rotation = Quaternion.Euler(0f, eulAngles.y, 0f);
    }

    public bool LoadSpatialAnchor(Guid guid)
    {
        var g = LoadGuid();
        foreach(var g2 in g){
            if(g2 == guid){
                anchorGuid = guid;
                LoadAnchorByUuid(new List<Guid>(){anchorGuid});
                return true;
            }
        }
        return false;
    }

    private IEnumerator AnchorCreation(OVRSpatialAnchor ovrAnchor)
    {
        while (!ovrAnchor.Created && !ovrAnchor.Localized)
        {
            yield return null;
        }

        if (anchorGuid != Guid.Empty)
        {
            var erase = AnchorErase(new List<Guid>(){anchorGuid});
            while (!erase.IsCompleted) yield return null;
        }

        Debug.Log("Trying to save anchor!");
        var save = AnchorSave(ovrAnchor);
        float saveTimeout = Time.time + 5f; // 5-second timeout for save operation
        while (!save.IsCompleted)
        {
            if (Time.time > saveTimeout)
            {
                Debug.Log("Saving anchor timed out.");
                yield break;
            }
            yield return null;
        }

        if (save.Status == TaskStatus.RanToCompletion)
        {
            anchor = ovrAnchor;
        }
    }

    private async Task AnchorSave(OVRSpatialAnchor a)
    {
        var result = await a.SaveAnchorAsync();
        if (result.Success)
        {
            Debug.Log($"Saved {a.Uuid}"!);
            anchorGuid = a.Uuid;
            SaveGuid(anchorGuid);
        }
        else
        {
            Debug.Log($"Failed to save {a.Uuid}!: {result.Status}");
        }
    }

    private async Task AnchorErase(List<Guid> uuids)
    {
        var result = await OVRSpatialAnchor.EraseAnchorsAsync(null, uuids);
        if (result.Success)
        {
            Debug.Log($"Erased {string.Join(", ", uuids.Select(guid => guid.ToString()).ToArray())}"!);
            anchorGuid = Guid.Empty;
        }
        else
        {
            Debug.LogError($"Failed to erase {uuids}!: {result.Status}");
        }
    }

    private async Task LoadAnchorByUuid(IEnumerable<Guid> uuids)
    {
        var result = await OVRSpatialAnchor.LoadUnboundAnchorsAsync(uuids, unboundAnchors);

        if (result.Success)
        {
            Debug.Log($"Loaded Anchors.");

            foreach (var unboundAnchor in result.Value)
            {
                unboundAnchor.LocalizeAsync().ContinueWith((success, a) =>
                {
                    if (success)
                    {
                        // Create a new game object with an OVRSpatialAnchor component
                        instantiatedAnchor = Instantiate(anchorPrefab);
                        var spatialAnchor = instantiatedAnchor.AddComponent<OVRSpatialAnchor>();

                        // Step 3: Bind
                        // Because the anchor has already been localized, BindTo will set the
                        // transform component immediately.
                        unboundAnchor.BindTo(spatialAnchor);
                        anchor = spatialAnchor;
                    }
                    else
                    {
                        Debug.LogError($"Localization failed for anchor {unboundAnchor.Uuid}");
                    }
                }, unboundAnchor);
            }
        }
        else
        {
            Debug.Log($"Failed to load anchors: {result.Status}");
        }
    }

    public void SaveGuid(Guid guid)
    {
        PlayerPrefs.SetString(PlayerPrefsKey, guid.ToString());
        PlayerPrefs.Save();

        Debug.Log("Guid saved successfully.");
    }

    public List<Guid> LoadGuid()
    {
        // Get the string from PlayerPrefs
        string guidString = PlayerPrefs.GetString(PlayerPrefsKey, string.Empty);
        Debug.Log($"Read PlayerPrefs! GUID: {guidString}");

        // If the string is empty, return a new list
        if (string.IsNullOrEmpty(guidString))
        {
            Debug.Log("No Guid found, returning default");
            anchorGuid = defaultGuid;
            List<Guid> newGuids = new List<Guid>();
            newGuids.Add(anchorGuid); 
            return newGuids;
        }
        
        var guidList = new List<Guid>();
        debugGuid = guidString;
        guidList.Add(Guid.Parse(guidString));

        Debug.Log("Guid loaded successfully.");
        return guidList; 
    }
}
