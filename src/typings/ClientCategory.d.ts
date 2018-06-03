import { NAME, BLOGS, CATEGORIES } from '../constants/names';
import { ClientNavBlog } from './ClientNavBlog';

interface ClientCategory {
  [ NAME ]: string
  [ BLOGS ]: ClientNavBlog[]
  [ CATEGORIES ]: ClientCategory[]
}