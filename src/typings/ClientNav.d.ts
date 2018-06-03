import { ClientNavCategory } from './ClientNavCategory';
import { NEWEST_BLOGS, CATEGORY, TAGS } from '../constants/names';
import { ClientNavBlog } from './ClientNavBlog';

interface ClientNav {
  [ NEWEST_BLOGS ]: ClientNavBlog[]
  [ CATEGORY ]: ClientNavCategory,
  [ TAGS ]: string[]
}