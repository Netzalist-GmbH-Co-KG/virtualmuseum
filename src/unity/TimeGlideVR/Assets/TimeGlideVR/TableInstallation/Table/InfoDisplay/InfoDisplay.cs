using TMPro;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.Table.InfoDisplay
{
    public class InfoDisplay : MonoBehaviour
    {
        [SerializeField] private TextMeshPro title;
        [SerializeField] private TextMeshPro description;

        public void DisplayTitle(string title)
        {
            if(this.title==null) return;
            this.title.text = title;
        }
    
        public void DisplayDescription(string description)
        {
            if(this.description==null) return;
            this.description.text = description;
        }
    
    }
}
