import { NAME, BLOGS, CATEGORIES, ALL_BLOGS } from '../constants/names';
import { BlogInfo } from './BlogInfo';

interface Category {
  [ NAME ]: string
  [ BLOGS ]: BlogInfo[]
  [ ALL_BLOGS ]: BlogInfo[]
  [ CATEGORIES ]: Category[]
}

interface Tag {
  [ NAME ]: string,
  [ BLOGS ]: BlogInfo[]
}