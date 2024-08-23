using System.Collections;
using System.Collections.Generic;
using TimeGlideVR.TableInstallation.Table.Panel.Button;
using TimeGlideVR.ThemeManager;
using UnityEngine;

public class ThemeSwitcher : MonoBehaviour
{
    [SerializeField]
    private GameObject buttonPrefab;
    private readonly Dictionary<string, ButtonScript> _buttons = new();
    private ThemeManager _themeManager;

    // SlideUp is called before the first frame update
    private void Start()
    {
        _themeManager = FindObjectOfType<ThemeManager>();
     
        foreach (var theme in _themeManager.AvailableThemes)
        {
            AddButton(theme);
        }
    }


    private void AddButton(string label)
    {
        Debug.Log($"Adding button: {label}");
        var button = Instantiate(buttonPrefab, transform);
        button.transform.localScale = new Vector3(transform.localScale.x, transform.localScale.y * 2, transform.localScale.z);
        var buttonScript = button.GetComponentInChildren<ButtonScript>();
        buttonScript.Init(label);
        buttonScript.onClick.AddListener(HandleButtonClick);
        buttonScript.SetSelected(label == "Default");
        var location = NextButtonLocation();
        button.transform.localPosition = location;
        _buttons.Add(label, buttonScript);
    }

    private void HandleButtonClick(ToggleButtonEvent clickEvent)
    {
        var theme = clickEvent.IsSelected ? clickEvent.Name : "Default";
        foreach (var button in _buttons)
        {
            button.Value.SetSelected(button.Key == theme);
        }
        _themeManager.SetTheme(theme);
    }

    // Update is called once per frame
    private Vector3 NextButtonLocation()
    {
        var row = _buttons.Count % 16;
        return new Vector3(-1.62f, 0.09f, 0.544f + row * 0.232f);
    }
}
