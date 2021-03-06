
// Función que calcula el grupo predominante
export function predominant(array: string[]): string {
  var modeMap: any = {};
  var maxEl = array[0], maxCount = 1;
  for(var i = 0; i < array.length; i++) {
    var el = array[i];
    if(modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;  
    if(modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}