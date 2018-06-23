import { CONFIG, NAV } from './../constants/names';
import { ClientNavConfig } from "./ClientNavConfig"
import { ClientNav } from "./ClientNav"


interface ClientNavGV {
  [ CONFIG ]: ClientNavConfig
  [ NAV ]   : ClientNav
} 