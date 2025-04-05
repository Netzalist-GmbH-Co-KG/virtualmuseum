namespace TimeGlideVR.TableInstallation.Table.Panel.Button
{
    public class ToggleButtonEvent
    {
        public ToggleButtonEvent(string name, bool isSelected, int mapIndex, int buttonIndex)
        {
            Name = name;
            IsSelected = isSelected;
            this.mapIndex = mapIndex;
            this.buttonIndex = buttonIndex;
        }

        public string Name;
        public bool IsSelected;
        public int mapIndex;
        public int buttonIndex;
    }
}