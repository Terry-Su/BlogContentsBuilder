import { NAME, BLOGS, CATEGORIES, ALL_BLOGS } from '../constants/names';
import { ClientNavBlog } from './ClientNavBlog';

interface ClientCategory {
  [ NAME ]: string
  [ BLOGS ]: ClientNavBlog[]
  [ ALL_BLOGS ]: ClientNavBlog[]
  [ CATEGORIES ]: ClientCategory[]
}