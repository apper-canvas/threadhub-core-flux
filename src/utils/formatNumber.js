export function formatNumber(num) {
  if (num < 1000) {
    return num.toString();
  }
  
  if (num < 1000000) {
    const thousands = (num / 1000).toFixed(1);
    return thousands.endsWith(".0") ? 
      Math.floor(thousands) + "k" : 
      thousands + "k";
  }
  
  const millions = (num / 1000000).toFixed(1);
  return millions.endsWith(".0") ? 
    Math.floor(millions) + "m" : 
    millions + "m";
}