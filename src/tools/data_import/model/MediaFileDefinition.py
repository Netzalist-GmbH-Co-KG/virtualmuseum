class MediaType:
    Image2D = 0
    Image3D = 1
    Image360Degree = 2
    Video2D = 3
    Video3D = 4
    Video360Degree = 5
    Audio = 6


class MediaFile:
    Id: str
    Name: str
    Description: str
    FileName: str
    Type: int
    Url: str
