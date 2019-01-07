import { EventSchemaAliases } from '../../models/EventSchema';
import moment from 'moment';

function convert(eventObj) {
  if (arguments[1] && arguments[1].length === 4) {
    eventObj.start =
      moment(eventObj[arguments[1][0]] + " " + eventObj[arguments[1][1]]).toDate();
    eventObj.end =
      moment(eventObj[arguments[1][2]] + " " + eventObj[arguments[1][3]]).toDate();

    for (var o in arguments[1]) {
      delete eventObj[arguments[1][o]];
    }
  }

  var keysToDelete = [];
  for (var k in eventObj) {
    if (EventSchemaAliases[k]) {
      keysToDelete.push(k);
    }
  }
  if (keysToDelete.length === 0) return eventObj;
  for (var i in keysToDelete) {
    eventObj[EventSchemaAliases[keysToDelete[i]]] = eventObj[keysToDelete[i]];
    delete eventObj[keysToDelete[i]];
  }
  return eventObj;
}

export default convert;
