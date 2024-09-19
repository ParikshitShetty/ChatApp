// Function return file size in human readable format
// Arg 1: size in bytes , Arg 2: decimal places for precision
export function formatFileSize(bytes,decimalPoint) {
  if(bytes == 0) return '0 Bytes';

  const k = 1000,
  dm = decimalPoint || 2,
  sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Splits a string wherever it finds "/"
export function fileNameSplitter(filename) {
  const array = String(filename).split('/');
  const finalName = array[(array.length - 1)];
  return finalName;
}