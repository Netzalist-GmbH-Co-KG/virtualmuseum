// Media file interface
export interface MediaFile {
  id: string
  fileName: string
  name: string
  description: string
  durationInSeconds: number
  type: string
  url: string
}

// Presentation item interface
export interface PresentationItem {
  id: string
  slotNumber: number
  sequenceNumber: number
  durationInSeconds: number
  mediaFile: MediaFile
}

// Presentation interface
export interface Presentation {
  id: string
  name: string
  description: string
  presentationItems: PresentationItem[]
}
