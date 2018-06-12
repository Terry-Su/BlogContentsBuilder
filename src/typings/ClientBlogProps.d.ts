import { RELATIVE_CLIENT_URL, CATEGORY_SEQUENCE } from '../constants/names';
import {
  NAME,
  CREATE_TIME,
  TAGS,
} from "../constants/names"

interface ClientBlogProps {
  [NAME]: string
  [CREATE_TIME]: string
  [CATEGORY_SEQUENCE]: string[]
  [TAGS]: string[]
}
