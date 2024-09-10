using TimeGlideVR.Server.Data;
using TimeGlideVR.Server.Data.TimeRows;

namespace TimeGlideVR.TableInstallation.Table.Panel
{
    public class DisplayLocationTimeRowEvent
    {
        public GeoEventGroup Row;
        public bool RemoveRow = false;

        public DisplayLocationTimeRowEvent(GeoEventGroup row, bool removeRow)
        {
            Row = row;
            RemoveRow = removeRow;
        }
    }
}