function keySwap(obj, options) {
  var retval = {};
  for (var key in obj) {
    if (options[key]) {
      retval[options[key]] = obj[key];
    }
    else retval[key] = obj[key];
  }
  return retval;
}

export default keySwap;
