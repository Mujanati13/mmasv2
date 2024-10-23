export function Endpoint(type = "dev") {
  return type == "dev"
    ? "https://JyssrMmas.pythonanywhere.com"
    : "http://51.38.99.75:2001/";
}
