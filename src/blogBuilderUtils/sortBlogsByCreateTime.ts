import { CREATE_TIME } from "../constants/names";
import { isValidDateString } from "./validate";

export default function (
  { [ CREATE_TIME ]: timeString1 }: any,
  { [ CREATE_TIME ]: timeString2 }: any
) {
  if ( isValidDateString( timeString1 ) && isValidDateString( timeString2 ) ) {
    const t1 = Date.parse( timeString1 )
    const t2 = Date.parse( timeString2 )
    return t2 - t1
  }
  return 0
}