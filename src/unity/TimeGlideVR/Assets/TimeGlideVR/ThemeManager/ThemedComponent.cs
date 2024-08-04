using System.Collections.Generic;
using UnityEngine;

namespace TimeGlideVR.ThemeManager
{
    public class ThemedComponent:MonoBehaviour
    {
        [SerializeField] 
        public MeshRenderer MeshRenderer;
        
        [SerializeField]
        private ThemedMaterials material;

        [SerializeField] private int materialSlot = 0;

        private ThemeManager _themeManager;
        
        private void Awake()
        {
            _themeManager = FindObjectOfType<ThemeManager>();
            if(_themeManager != null)
                _themeManager.onThemeChanged.AddListener(OnThemeChanged);
            
            OnThemeChanged(new ThemeChangedEvent { ThemePack = _themeManager.CurrentThemePack });
        }

        private void OnThemeChanged(ThemeChangedEvent evt)
        {
            if(evt.ThemePack == null)
                return;
            
            var themeItem = evt.ThemePack.GetThemeItem(material);
            if(themeItem == null)
                return;
            
            // Create a copy of the materials array
            var materials = MeshRenderer.materials;

            // Change the material at the specified slot
            materials[materialSlot] = themeItem;

            // Assign the updated materials array back to the MeshRenderer
            MeshRenderer.materials = materials;
        }
    }
}