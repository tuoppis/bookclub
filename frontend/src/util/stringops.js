export function breakCamel(str) {
  if (!str) return "";
  const rest = str.slice(1);
  const first = str[0].toUpperCase();
  return first + rest.replace(/([A-Z])/g, " $1");
}
