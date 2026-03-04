export const MAILERLITE_FORM_ID = "6122054";
export const MAILERLITE_FORM_CODE = "u8g2z9";

const MAILERLITE_SCRIPT_URL =
  "https://static.mailerlite.com/js/w/webforms.min.js?vd4de52e171e8eb9c47c0c20caf367ddf";

let scriptPromise: Promise<void> | null = null;

export function loadMailerLiteScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${MAILERLITE_SCRIPT_URL}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = MAILERLITE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load MailerLite script"));
    document.body.appendChild(script);
  });

  return scriptPromise;
}
