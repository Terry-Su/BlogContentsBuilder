import { NAME, BLOGS } from "../constants/names"
import { ClientNavBlog } from "./ClientNavBlog"

interface ClientTag {
  [NAME]: string
  [BLOGS]: ClientNavBlog[]
}
