from model.MediaFileDefinition import MediaFile


class MultiMediaPresentation:
    Id: str
    Name: str
    Description: str
    MediaFiles: list[MediaFile]
