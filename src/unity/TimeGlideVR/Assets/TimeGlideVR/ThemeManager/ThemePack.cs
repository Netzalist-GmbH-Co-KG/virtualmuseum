using UnityEngine;

namespace TimeGlideVR.ThemeManager
{
    public enum ThemedMaterials
    {
        TableFrame,
        PanelFrame,
        PanelBottom,
        PanelButton,
        PanelButtonFrame,
        Lid,
        LiftFrame,
        CinemaDoor,
        MainButton,
    }

    public class ThemePack : MonoBehaviour
    {
        [SerializeField] public Material tableFrameMaterial;
        [SerializeField] public Material panelFrameMaterial;
        [SerializeField] public Material panelBottomMaterial;
        [SerializeField] public Material panelButtonMaterial;
        [SerializeField] public Material panelButtonFrameMaterial;
        [SerializeField] public Material lidMaterial;
        [SerializeField] public Material liftFrameMaterial;
        [SerializeField] public Material cinemaDoorMaterial;
        [SerializeField] public Material mainButtonMaterial;

        public Material GetThemeItem(ThemedMaterials themeItemName)
        {
            return themeItemName switch
            {
                ThemedMaterials.TableFrame => tableFrameMaterial,
                ThemedMaterials.PanelFrame => panelFrameMaterial,
                ThemedMaterials.PanelBottom => panelBottomMaterial,
                ThemedMaterials.PanelButton => panelButtonMaterial,
                ThemedMaterials.PanelButtonFrame => panelButtonFrameMaterial,
                ThemedMaterials.Lid => lidMaterial,
                ThemedMaterials.LiftFrame => liftFrameMaterial,
                ThemedMaterials.CinemaDoor => cinemaDoorMaterial,
                ThemedMaterials.MainButton => mainButtonMaterial,
                _ => null
            };
        }
    }
}