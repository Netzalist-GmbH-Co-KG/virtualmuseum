
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using System.Linq;
using UnityEditor;

///A standard flag for displaying information about a point of interest
///Has start and endTime for defining first mention and last seen documentation of the point of interest as well as Color attribute for 
///categorization and visual clarity
public class StandardFlag : IFlag
{
    public int startTime { get; set; }
    public static int currentTime = 700; //704 is the date of the first city
    public static List<StandardFlag> flags = new List<StandardFlag>();
    public static List<StandardFlag> currentFlags = new List<StandardFlag>();
    public static List<AudioSource> audioSources = new List<AudioSource>();
    
    public static CityListScript cityListScript;
    public static StandardFlag selectedFlag;
    public Transform transform {get; set;}
    public Vector3 position { get; set; }
    public GameObject flagVisualTextComponent { get; set; }
    public GameObject flagVisualIndicator { get; set; }
    public string header { get; set; }
    public string info { get; set; }
    public GameObject image { get; set; }

    Color flagColor;
    public Transform visualComponentTransform;
    public Transform textTransform;
    private UnityAction<bool> pokedListener;
    public LineRenderer lineRenderer;


    private bool textIsSet = false;
    
    public StandardFlag(int startTime, Vector3 position, Transform transform, Color flagColor, string header = "test", string info = "no new info", GameObject image = null) {
        this.startTime = startTime;
        this.transform = transform;
        this.position = position;
        this.header = header;
        this.info = info;
        this.flagColor = flagColor;
        this.image = image;
        
        visualComponentTransform = transform.GetChild(0);
        // Debug.Log(visualComponentTransform.name);
        textTransform = transform.GetChild(1);
        pokedListener = new UnityAction<bool>(EventCallback);
        if(image != null) {
            SetColor(Color.blue);
        }
        lineRenderer = transform.GetComponentInChildren<LineRenderer>(true);
        lineRenderer.enabled = false;
        flags.Add(this);
        Deactivate();
    }

    public static void ResetStatics(){
        flags = new List<StandardFlag>();
        audioSources = new List<AudioSource>();
        currentTime = 700;
    }

    static public void DisplayBlock(int time){
        int latestStartTime = 0;
        if(cityListScript == null) cityListScript = GameObject.Find("CityList").GetComponent<CityListScript>();
        if(currentFlags.Count > 0) {
            currentFlags.ForEach(flag => flag.Deactivate());
            cityListScript.ClearCities();
            latestStartTime = currentFlags[currentFlags.Count - 1].startTime;
        }
        
        currentFlags = flags
                    .Where(flag => flag.startTime <= time && flag.startTime >= latestStartTime)
                    .ToList();
        currentFlags.Sort((flag1, flag2) => flag1.startTime.CompareTo(flag2.startTime));
        currentFlags.ForEach(flag => {
            flag.Activate();
            cityListScript.CreateCityUIRepresentation(flag);
            });
        currentTime = time;

        //Display markers with buttons linked to marker on UI. Upon UI button press, display marker information
    }

    static public void HideBlock(){
        currentFlags.ForEach(flag => flag.Deactivate());
        cityListScript.ClearCities();
        currentFlags = new List<StandardFlag>();
    }

    static public bool NextPeriod(){
        //nullable variable for storing potential next period
        int? nextTime = flags
            .Where(flag => flag.startTime > currentTime)
            .Select(flag => (int?)flag.startTime)
            .OrderBy(time => time)
            .FirstOrDefault();

        if(nextTime.HasValue){
            currentTime = nextTime.Value;
            DisplayMarkersOfPeriod(currentTime);
            return true;
        }
        return false;
    }

    static public bool LastPeriod(){
        //nullable variable for storing potential next period
        int? lastTime = flags
            .Where(flag => flag.startTime < currentTime)
            .Select(flag => (int?)flag.startTime)
            .OrderByDescending(time => time)
            .FirstOrDefault();

        if(lastTime.HasValue){
            currentTime = lastTime.Value;
            DisplayMarkersOfPeriod(currentTime);
            return true;
        }
        return false;
    }

    static public void DisplayMarkersOfPeriod(int period) {
        flags
        .Where(flag => flag.startTime == period)
        .ToList()
        .ForEach(flag => flag.Activate());

        flags.ForEach(flag => flag.UpdateColor());
    }

    //Change color according to distance between currentTime and startTime
    public void UpdateColor(){
        //Flag should be more red when fresher
        float r = 255 - (startTime - currentTime) / 4;
        float g = 0;
        float b = (startTime - currentTime) / 4;
        Color newColor = new Color(r,g,b);
        visualComponentTransform.GetComponent<MeshRenderer>().material.color = newColor;
        flagColor = newColor;
        }

    private void EventCallback(bool b) {
        if(b){
            ShowText();
        } else {
            HideText();
        }
    }

    public void SetColor(Color color){
        visualComponentTransform.GetComponent<MeshRenderer>().material.color = color;
        flagColor = color;
    }

    public void Activate() {
        //wait for animation and play sound
        // if(visualComponentTransform == null) visualComponentTransform = transform.GetChild(0);
        visualComponentTransform.gameObject.SetActive(true);
        Animator animator = visualComponentTransform.GetComponent<Animator>();
        AudioSource audioSource = visualComponentTransform.GetComponent<AudioSource>();
        if(!audioSources.Contains(audioSource)){
            audioSources.Add(audioSource);
        }
        bool isPlaying = false;
        foreach(var a in audioSources){
            if(a.isPlaying){
                isPlaying = true;
                break;
            }
        }
        if(!isPlaying) audioSource.Play();
        
        animator.Play("Base Layer.MarkerAnim", 0, 0);
        SetColor(Color.red);
    }

    public void Deactivate() {
        if(visualComponentTransform == null) return;
        visualComponentTransform.gameObject.SetActive(false);
        visualComponentTransform.GetComponent<InstantiateMarkerVisual>().DeactivateMarker();
    }

    public void ShowCubeMap(){
        image.SetActive(true);
    }

    public void HideCubeMap(){
        image.SetActive(false);
    }

    public void ShowText() {
        if(!textIsSet) SetText();
        foreach(var f in currentFlags){
            f.textTransform.gameObject.SetActive(false);
        }
        textTransform.gameObject.SetActive(true);
        selectedFlag = this;
    }

    public void ShowLineRenderer(){
        foreach(var f in currentFlags){
            if(!f.lineRenderer) continue;
            f.lineRenderer.enabled = false;
        }
        if(!lineRenderer) return;
        lineRenderer.enabled = true;
        lineRenderer.SetPosition(0, transform.position + Vector3.up * 0.25f);
        lineRenderer.SetPosition(1, transform.position + Vector3.up * 1.3f);
    }

    public void HideLineRenderer(){
        if(!lineRenderer) return;
        lineRenderer.enabled = false;
    }

    public void HideText() {
        var textTransform = transform.GetChild(1); 
        if(!textTransform.Equals(null)){
            textTransform.gameObject.SetActive(false);
        }
    }

    private void SetText() {
        textTransform.GetChild(0).GetComponent<TMP_Text>().text = header;
        textIsSet = true;
    }

    public static void OnDisable()
    {
        flags.Clear();
        currentTime = 700;
    }
}
