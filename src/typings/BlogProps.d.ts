import { NAME, CREATE_TIME, TAGS, INTRODUCTION, UNIQUE_HTML_NAME } from '../constants/names';

interface BlogProps {
  [NAME]?: string
  [CREATE_TIME]?: string
  [TAGS]?: string[],
  [INTRODUCTION]?: string,
  [UNIQUE_HTML_NAME]?: string
}
