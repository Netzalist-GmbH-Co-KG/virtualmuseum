from datetime import datetime
import os
import uuid

base_path = "C:\\Users\\tobia\\Downloads\\wetransfer_360-grad-fotos_2024-09-10_1643\\"
base_url = "https://timeglide-vr.b-cdn.net/wetransfer_360-grad-fotos_2024-09-10_1643/"
time_series_id = "8c472a83-e961-4bd3-b6f3-562964e322c4"


class GeoEventGroup:
    def __init__(self, id: str, label: str, time_series_id: str):
        self.id = id
        self.label = label


class GeoEvent:
    def __init__(
        self,
        id: str,
        multimedia_presentation_id: str,
        event_group_id,
        name: str,
        latitude: float,
        longitude: float,
        date_time: datetime,
    ):
        self.id = id
        self.multimedia_presentation_id = multimedia_presentation_id
        self.event_group_id = event_group_id
        self.name = name
        self.latitude = latitude
        self.longitude = longitude
        self.date_time = date_time


class MultimediaPresentation:
    def __init__(self, id: str, name: str):
        self.id = id
        self.name = name


class PresentationItem:
    def __init__(
        self,
        id: str,
        media_file_id: str,
        multimedia_presentation_id: str,
        sequence: int,
    ):
        self.id = id
        self.media_file_id = media_file_id
        self.multimedia_presentation_id = multimedia_presentation_id
        self.sequence = sequence


class MediaFile:
    def __init__(self, id: str, url: str, name: str, group: str):
        self.id = id
        self.url = url
        self.name = name
        self.group = group


def read_all_media_files(base_path: str, verify: bool = False) -> list[MediaFile]:
    result = []
    for _, _, files in os.walk(base_path):
        for file in files:
            if file.endswith(".jpg"):
                url = base_url + file.replace(" ", "%20")
                # verify that the url is reachable, suppress output
                if (not verify) or (os.system(f"curl -I {url} > nul") == 0):
                    # the first characters until the first space are the group of the image
                    group = file.split(" ")[0]
                    result.append(MediaFile(str(uuid.uuid4()), url, file, group))
                else:
                    print(f"File {url} is not reachable")
    return result


def create_groesste_staedte():
    media_files = read_all_media_files(base_path)
    groups = set([media_file.group for media_file in media_files])

    multimedia_presentations = []
    geo_events = []
    presentation_items = []
    geo_event_groups = []

    for group in groups:
        print(f"Group {group}:")

        # create a multimedia presentation for each group
        multimedia_presentation = MultimediaPresentation(str(uuid.uuid4()), group)
        multimedia_presentations.append(multimedia_presentation)
        geo_event_group = GeoEventGroup(str(uuid.uuid4()), group, time_series_id)
        geo_event_groups.append(geo_event_group)
        geo_event = GeoEvent(
            str(uuid.uuid4()),
            multimedia_presentation.id,
            geo_event_group.id,
            group,
            0,
            0,
            datetime.now(),
        )
        geo_events.append(geo_event)

        # create a presentation item for each media file in the group
        for i, media_file in enumerate(media_files):
            if media_file.group == group:
                presentation_item = PresentationItem(
                    str(uuid.uuid4()), media_file.id, multimedia_presentation.id, i
                )
                presentation_items.append(presentation_item)

    # write some csv files
    with open(f"multimedia_presentations.csv", "w") as f:
        f.write("Id,Name,Description\n")
        for multimedia_presentation in multimedia_presentations:
            f.write(
                f"{multimedia_presentation.id},{multimedia_presentation.name},{multimedia_presentation.name}\n"
            )

    with open(f"geo_events.csv", "w") as f:
        f.write(
            "Id,GeoEventGroupId,MultiMediaPresentationId,Name,Description,DateTime,Latitude,Longitude\n"
        )
        for geo_event in geo_events:
            f.write(
                f"{geo_event.id},{geo_event.event_group_id},{geo_event.multimedia_presentation_id},{geo_event.name},{geo_event.name},{geo_event.date_time},{geo_event.latitude},{geo_event.longitude}\n"
            )

    with open(f"presentation_items.csv", "w") as f:
        f.write(
            "Id,MultiMediaPresentationId,MediaFileId,SlotNumber,SequenceNumber,DurationInSeconds\n"
        )
        for presentation_item in presentation_items:
            f.write(
                f"{presentation_item.id},{presentation_item.multimedia_presentation_id},{presentation_item.media_file_id},2,{presentation_item.sequence},5\n"
            )
    with open(f"geo_event_groups.csv", "w") as f:
        f.write("Id,Name,Description,TimeSeriesId\n")
        for geo_event_group in geo_event_groups:
            f.write(
                f"{geo_event_group.id},{geo_event_group.label},{geo_event_group.label},{time_series_id}\n"
            )

    with open(f"media_files.csv", "w") as f:
        f.write("Id,FileName,Name, Description,DurationInSeconds,Type,Url\n")
        for media_file in media_files:
            f.write(
                f"{media_file.id},{media_file.name},{media_file.name},{media_file.name},0,2,{media_file.url}\n"
            )




if __name__ == "__main__":
    create_groesste_staedte()
