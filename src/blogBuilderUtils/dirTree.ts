import { FILE, DIRECTORY } from '../constants/names';


export const isFileType = ( type: string ) => type === FILE
export const isDirectoryType = ( type: string ) => type === DIRECTORY

export const filterIsFileType = ( { type }: any ) => type === FILE
export const filterIsDirectoryType = ( { type }: any ) => type === DIRECTORY

export const filterFindFileByName = ( fileName: string ) => ( { type, name }: any ) => type === FILE && name === fileName