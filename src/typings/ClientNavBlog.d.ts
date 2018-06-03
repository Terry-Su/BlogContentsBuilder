import {
  NAME,
  CREATE_TIME,
  INTRODUCTION,
  RELATIVE_CLIENT_URL
} from "../constants/names"

interface ClientNavBlog {
  /**
   * Url that is relative to client root path
   */
  [RELATIVE_CLIENT_URL]: string
  [NAME]: string
  [CREATE_TIME]: string
  [INTRODUCTION]: string
}
