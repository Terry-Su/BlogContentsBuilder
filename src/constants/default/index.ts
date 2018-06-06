import {
  ALL,
  TOP_DIRECTORY_NAME,
  NAME_NEWEST_BLOGS_COUNT,
  INSERTED_SCRIPTS,
  CLIENT_TEXT_LOGO,
  CLIENT_IMAGE_LOGO,
  CLIENT_SLOGAN
} from "../names"
import { Config } from "../../typings/Config"
import { NEWEST_BLOGS_COUNT } from "../numbers"

export const DEFAULT_CONFIG: Config = {
  [ TOP_DIRECTORY_NAME ]     : ALL,
  [ NAME_NEWEST_BLOGS_COUNT ]: NEWEST_BLOGS_COUNT,
  [ INSERTED_SCRIPTS ]       : [],
  [ CLIENT_TEXT_LOGO ]       : "Blog",
  [ CLIENT_IMAGE_LOGO ]      : "",
  [ CLIENT_SLOGAN ]          : "Slogan"
}
