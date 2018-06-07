import {
  TOP_DIRECTORY_NAME,
  NAME_NEWEST_BLOGS_COUNT,
  INSERTED_SCRIPTS
} from "../constants/configNames"

interface Config {
  [TOP_DIRECTORY_NAME]: string
  [NAME_NEWEST_BLOGS_COUNT]: number
  [INSERTED_SCRIPTS]: string[]
}
