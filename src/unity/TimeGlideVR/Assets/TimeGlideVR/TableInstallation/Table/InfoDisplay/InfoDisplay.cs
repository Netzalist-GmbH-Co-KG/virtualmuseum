using TMPro;
using UnityEngine;

namespace TimeGlideVR.TableInstallation.Table.InfoDisplay
{
    public class InfoDisplay : MonoBehaviour
    {
        public static InfoDisplay Instance { get; private set; }
        [SerializeField] private TextMeshPro title;
        [SerializeField] private TextMeshPro description;

        private void Awake()
        {
            Instance = this;
        }
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
