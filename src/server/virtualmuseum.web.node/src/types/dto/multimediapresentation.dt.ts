import { MultimediaPresentation, PresentationItem, MediaFile } from '../';


export interface PresentationItemWithMediaFile extends PresentationItem {
    MediaFile: MediaFile
}

export interface MultimediaPresentationWithPresentationItems extends MultimediaPresentation {
    PresentationItems: PresentationItemWithMediaFile[]
}
