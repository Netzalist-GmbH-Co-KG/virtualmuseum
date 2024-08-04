using TimeGlideVR.Server.Data;

namespace TimeGlideVR.TableInstallation.Table.Panel
{
    public class DisplayLocationTimeRowEvent
    {
        public LocationTimeRow Row;
        public bool RemoveRow = false;

        public DisplayLocationTimeRowEvent(LocationTimeRow row, bool removeRow)
        {
            Row = row;
            RemoveRow = removeRow;
        }
    }
}