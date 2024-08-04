namespace TimeGlideVR.TableInstallation.Table.Panel.Button
{
    public class ToggleButtonEvent
    {
        public ToggleButtonEvent(string name, bool isSelected)
        {
            Name = name;
            IsSelected = isSelected;
        }

        public string Name;
        public bool IsSelected;
    }
}