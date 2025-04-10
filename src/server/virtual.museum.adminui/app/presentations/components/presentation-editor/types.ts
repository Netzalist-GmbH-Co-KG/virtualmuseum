// Types for the presentation editor
export type MediaFile = {
    id: string
    fileName: string
    name: string
    description: string
    durationInSeconds: number
    type: string
    url: string
  }
  
  export type Clip = {
    id: string
    sequenceNumber: number
    durationInSeconds: number
    mediaFile: MediaFile
  }
  
  export type Track = {
    id: string
    name: string
    slotNumber: number
    clips: Clip[]
  }
  
  export type Presentation = {
    id: string
    name: string
    description: string
    tracks: Track[]
  }
  