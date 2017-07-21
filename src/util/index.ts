export function readomString(length: number = 32) {
  const possibleStr: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const tempStrArr: string[] = [];
  for (let i = 0; i < length; i++) {
    tempStrArr.push(possibleStr.charAt(Math.floor(Math.random() * length)));
  }
  return tempStrArr.join('');
}
