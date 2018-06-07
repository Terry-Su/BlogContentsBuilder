import {
  ALL,
} from "../names"
import { Config } from "../../typings/Config"
import { NEWEST_BLOGS_COUNT } from "../numbers"
import { TOP_DIRECTORY_NAME, NAME_NEWEST_BLOGS_COUNT, INSERTED_SCRIPTS } from '../configNames';

export const DEFAULT_CONFIG: Config = {
  [ TOP_DIRECTORY_NAME ]     : ALL,
  [ NAME_NEWEST_BLOGS_COUNT ]: NEWEST_BLOGS_COUNT,
  [ INSERTED_SCRIPTS ]       : [],
}
