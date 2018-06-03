import {
  isFileType,
  filterFindFileByName,
  isDirectoryType,
  filterIsDirectoryType
} from "./dirTree"
import { BLOG_PROPS_FILE_NAME } from "../constants/fileNames"
import { FILE } from "../constants/names"
import { isMarkdownFileName } from "./validate"

export const isBlogDirectoryInfo = ( { children }: any ) =>
  children.some(
    ( { type, name }: any ) => isFileType( type ) && name === BLOG_PROPS_FILE_NAME
  )

export const getBlogPropsFilePath = ( directoryInfo: any ): string => {
  const { children } = directoryInfo
  const fileInfo = children.filter(
    filterFindFileByName( BLOG_PROPS_FILE_NAME )
  )[ 0 ]
  return fileInfo ? fileInfo.path : null
}

export const getBlogFilePath = ( directoryInfo: any ): string => {
  const { children } = directoryInfo
  const fileInfo = children.filter(
    ( { type, name }: any ) => type === FILE && isMarkdownFileName( name )
  )[ 0 ]
  return fileInfo ? fileInfo.path : null
}
