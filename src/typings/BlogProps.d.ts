import { NAME, CREATE_TIME, TAGS, INTRODUCTION } from '../constants/names';

interface BlogProps {
  [NAME]?: string
  [CREATE_TIME]?: string
  [TAGS]?: string[],
  [INTRODUCTION]?: string
}
