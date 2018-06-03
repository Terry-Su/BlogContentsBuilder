import { NAME, BLOGS, CATEGORIES } from '../constants/names';
import { BlogInfo } from './BlogInfo';

interface Category {
  [ NAME ]: string
  [ BLOGS ]: BlogInfo[]
  [ CATEGORIES ]: Category[]
}

interface Tag {
  [ NAME ]: string,
  [ BLOGS ]: BlogInfo[]
}