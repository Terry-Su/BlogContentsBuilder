import { ClientNavCategory } from "./ClientNavCategory"
import {
  NEWEST_BLOGS,
  CATEGORY,
  TAGS,
  CLIENT_TEXT_LOGO,
  CLIENT_IMAGE_LOGO,
  CLIENT_SLOGAN
} from "../constants/names"
import { ClientNavBlog } from "./ClientNavBlog"

interface ClientNav {
  [NEWEST_BLOGS]: ClientNavBlog[]
  [CATEGORY]: ClientNavCategory
  [TAGS]: string[]
  [CLIENT_TEXT_LOGO]: string
  [CLIENT_IMAGE_LOGO]: string
  [CLIENT_SLOGAN]: string
}
