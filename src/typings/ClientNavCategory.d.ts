import { NAME, CATEGORIES } from '../constants/names';
interface ClientNavCategory {
  [ NAME ]: string  
  [ CATEGORIES ]: ClientNavCategory[]
}