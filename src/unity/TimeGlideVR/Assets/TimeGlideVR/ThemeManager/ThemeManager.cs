using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.Events;

namespace TimeGlideVR.ThemeManager
{
    public class ThemeChangedEvent
    {
        public ThemePack ThemePack { get; set; }
    }
    
    public class ThemeManager : MonoBehaviour
    {
        public UnityEvent<ThemeChangedEvent> onThemeChanged;
        
        private Dictionary<string,ThemePack> _themePacks = new Dictionary<string, ThemePack>();

        internal ThemePack CurrentThemePack;
        
        private void Start()
        {
            _themePacks = GetComponentsInChildren<ThemePack>().Select( tp=> new KeyValuePair<string, ThemePack>(tp.name, tp)).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            SetTheme("Default");
            // StartCoroutine(ToggleTheme());
        }
        
        private IEnumerator ToggleTheme()
        {
            while (true)
            {
                yield return new WaitForSeconds(2);
                var theme = AvailableThemes[Random.Range(0, AvailableThemes.Count)];
                Debug.Log($"Setting theme to {theme}");
                SetTheme(theme);
            }
        }
        
        public List<string> AvailableThemes => _themePacks.Keys.ToList();
        
        public void SetTheme(string themeName)
        {
            if(!_themePacks.ContainsKey(themeName))
                themeName = "Default";

            if (!_themePacks.ContainsKey(themeName))
            {
                Debug.LogWarning($"Theme {themeName} not found");
                return;
            }
            
            CurrentThemePack = _themePacks[themeName];
            onThemeChanged.Invoke(new ThemeChangedEvent{ThemePack = _themePacks[themeName]});
        }
    }
}
