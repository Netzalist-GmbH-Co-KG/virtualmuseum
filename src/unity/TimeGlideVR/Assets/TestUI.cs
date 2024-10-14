using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TimeGlideVR.TableInstallation.Lift.Button;
using TimeGlideVR.TableInstallation.Table.Panel;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using UnityEngine;
using UnityEngine.Serialization;
using UnityEngine.UI;

public class TestUI : MonoBehaviour
{
    
    [SerializeField] 
    private Button liftButton;
    [SerializeField] 
    private Button groessteStaedteButton;
    [SerializeField]
    private Button meiningenButton;
    [SerializeField]
    private Button casettePlayButton;

    
    
    [SerializeField]
    private ButtonHandler liftButtonHandler;
    [SerializeField]
    private ButtonScript groessteStaedteButtonScript;
    [SerializeField]
    private ButtonPanelScript buttonPanelScript;
    [SerializeField] 
    private CassettePlayer cassettePlayer;
    
    // Start is called before the first frame update
    void Start()
    {
        liftButton.onClick.AddListener(HandleLiftButtonClick);
        groessteStaedteButton.onClick.AddListener(HandleGroessteStaedteButtonClick);
        meiningenButton.onClick.AddListener(HandleMeiningenButtonClick);
        casettePlayButton.onClick.AddListener(HandleMediaPlayButtonClick);
    }

    private void HandleMeiningenButtonClick()
    {
        var meinigenButton = buttonPanelScript.Buttons.FirstOrDefault(b => b.Key == "MGN");
        if(meinigenButton.Value != null)
            meinigenButton.Value.GetComponent<ButtonScript>().HandleSelect();
    }

    private void HandleMediaPlayButtonClick()
    {
        var allCassettes = FindObjectsOfType<Cassette>();
        var firstCassette = allCassettes.FirstOrDefault();
        if(firstCassette == null) return;
        cassettePlayer.InsertCassette(firstCassette.gameObject);
        cassettePlayer.TryReadCassette();
    }

    private void HandleGroessteStaedteButtonClick()
    {
        groessteStaedteButtonScript.HandleSelect();
    }

    private void HandleLiftButtonClick()
    {
        liftButtonHandler.HandleButtonClick();
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
