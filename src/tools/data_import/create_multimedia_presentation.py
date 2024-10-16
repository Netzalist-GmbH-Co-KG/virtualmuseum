import os
import uuid

from model.MediaFileDefinition import MediaFile, MediaType
from model.MultiMediaPresentationDefinition import MultiMediaPresentation


# Multimedia Presentations
def create_multimedia_presentations(base_path: str):
    multimedia_dirs = find_multimedia_dirs(base_path)
    for multimedia_dir in multimedia_dirs:
        create_multimedia_presentation(multimedia_dir)
    print(multimedia_dirs)


def create_multimedia_presentation(presentation_directory: str):
    files = find_multimedia_files(presentation_directory)

    presentation = create_default_multimedia_presentation(presentation_directory)
    presentation = try_read_metadata_file_for_presenation(
        presentation, presentation_directory
    )
    save_metadata_file_for_presenation(presentation, presentation_directory)
    presentation.MediaFiles = create_media_files(files)


def create_default_multimedia_presentation(
    presentation_directory: str,
) -> MultiMediaPresentation:
    presentation = MultiMediaPresentation()
    presentation.Id = str(uuid.uuid4())
    presentation.Name = os.path.basename(presentation_directory)
    presentation.Description = ""
    return presentation


def try_read_metadata_file_for_presenation(
    presentation: MultiMediaPresentation, presentation_directory: str
) -> MultiMediaPresentation:
    meta_data_file_path = (
        presentation_directory
        + os.path.sep
        + os.path.basename(presentation_directory)
        + ".txt"
    )
    if os.path.exists(meta_data_file_path):
        meta_data_file = open(meta_data_file_path, "r")

        lines = meta_data_file.readlines()
        # check if we have at least 3 lines
        if len(lines) < 3:
            print(
                f"Invalid metadata file for {presentation_directory}: Needs at least 3 lines but has {len(lines)}"
            )
        presentation.Name = lines[0].strip()
        presentation.Description = "".join(lines[1:-1]).strip()
        presentation.Id = lines[-1].strip()
        meta_data_file.close()

    return presentation


def save_metadata_file_for_presenation(
    presentation: MultiMediaPresentation, presentation_directory: str
):
    meta_data_file_path = (
        presentation_directory
        + os.path.sep
        + os.path.basename(presentation_directory)
        + ".txt"
    )
    meta_data_file = open(meta_data_file_path, "w")
    meta_data_file.write(presentation.Name + "\n")
    meta_data_file.write(presentation.Description + "\n")
    meta_data_file.write(presentation.Id + "\n")
    meta_data_file.close()


def find_multimedia_dirs(base_path: str):
    all_dirs = []
    # walk through the base_path and find all directories 6 levels beneath it
    for root, _, _ in os.walk(base_path):
        # check if the depth of the current directory is 6
        if root.count(os.sep) - base_path.count(os.sep) == 6:
            all_dirs.append(root)

    return all_dirs


# Media Files
def find_multimedia_files(multimedia_dir: str) -> list[str]:
    # all .jpg, .png, .mp4, .mp3 files in the multimedia_dir. Do not include subdirectories
    multimedia_files = []
    for file in os.listdir(multimedia_dir):
        if (
            file.endswith(".jpg")
            or file.endswith(".png")
            or file.endswith(".mp4")
            or file.endswith(".mp3")
        ):
            multimedia_files.append(multimedia_dir + os.sep + file)

    return multimedia_files


def create_media_files(media_file_paths: list[str]) -> list[MediaFile]:
    media_files: list[MediaFile] = []
    # check if a text file with the same name exists in the same directory

    for media_file_path in media_file_paths:
        media_file = create_default_media_data(media_file_path)
        media_file = try_read_metadata_file(media_file, media_file_path)
        save_metadata_file(media_file, media_file_path)
        media_files.append(media_file)
    return media_files


def create_default_media_data(media_file_path: str) -> MediaFile:
    media_file = MediaFile()
    media_file.FileName = os.path.basename(media_file_path)
    media_file.Id = str(uuid.uuid4())
    media_file.Name = media_file.FileName
    media_file.Description = ""
    media_file.Url = ""
    # TODO: distinguish 360 degree, 2D and 3D images and videos
    if media_file_path.endswith(".jpg") or media_file_path.endswith(".png"):
        media_file.Type = MediaType.Image2D
    elif media_file_path.endswith(".mp4"):
        media_file.Type = MediaType.Video360Degree
    elif media_file_path.endswith(".mp3"):
        media_file.Type = MediaType.Audio

    return media_file


def try_read_metadata_file(media_file: MediaFile, media_file_path: str) -> MediaFile:
    meta_data_file_path = media_file_path + ".txt"
    if os.path.exists(meta_data_file_path):
        meta_data_file = open(meta_data_file_path, "r")
        # the first line is the name of the media file
        # the last line is the id (uuid) of the media file
        # all lines in between are the description of the media file
        # the description can be multiple lines it must be at least one line (can be empty)

        lines = meta_data_file.readlines()
        # check if we have at least 3 lines
        if len(lines) < 3:
            print(
                f"Invalid metadata file for {media_file_path}: Needs at least 3 lines but has {len(lines)}"
            )
        media_file.Name = lines[0].strip()
        media_file.Description = "".join(lines[1:-1]).strip()
        media_file.Id = lines[-1].strip()
        meta_data_file.close()

    return media_file


def save_metadata_file(media_file: MediaFile, media_file_path: str):
    meta_data_file_path = media_file_path + ".txt"
    meta_data_file = open(meta_data_file_path, "w")
    meta_data_file.write(media_file.Name + "\n")
    meta_data_file.write(media_file.Description + "\n")
    meta_data_file.write(media_file.Id + "\n")
    meta_data_file.close()


if __name__ == "__main__":
    create_multimedia_presentations(
        "C:\\src\\ntlt\\virtualmuseum\\src\\tools\\data_import\\input\\schloss_wilhelmsburg"
    )
