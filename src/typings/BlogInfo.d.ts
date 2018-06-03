import { RELATIVE_CLIENT_URL } from '../constants/names';
import {
  NAME,
  CREATE_TIME,
  TAGS,
  NAME_PATH,
  INTRODUCTION
} from "../constants/names"

interface BlogInfo {
  [NAME_PATH]: string
  [RELATIVE_CLIENT_URL]: string,
  [NAME]: string
  [CREATE_TIME]: string
  [TAGS]: string[]
  [INTRODUCTION]: string
}
