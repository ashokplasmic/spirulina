# Spirulina Circular Biorefinery Dashboard

A responsive project website and sensor dashboard based on the supplied Spirulina circular biorefinery presentation. It includes the project rationale, objectives, circular product pathways, sensor overview, planned milestones, team, and a sensor dashboard. It works as a visual demo without an ESP32 and can display live readings when the device exposes a small HTTP endpoint.

## Open the website

Open `index.html` in a modern browser. No build step or package installation is required.

## Publish with GitHub Pages

The folder is a static site and can be published without a build step. Create a GitHub repository, upload the contents of this folder to the repository root, then open **Settings → Pages** and select deployment from the `main` branch and `/ (root)`. GitHub Pages will provide a public `github.io` address after deployment completes.

## Connect the ESP32

The dashboard requests `GET http://<ESP32-IP>/api/sensors` every five seconds after connecting. Return JSON in this shape:

```json
{
  "temperature": 28.4,
  "humidity": 64,
  "ph": 8.6
}
```

The field names are case-sensitive and values must be numbers. The ESP32 web server must allow cross-origin requests from the page (`Access-Control-Allow-Origin: *`) if the page is opened from a different origin. If you serve the page and API from the same origin, CORS is not needed. Keep both devices on the same Wi-Fi network; an IP address such as `http://192.168.1.50` can be entered from **Connect device**.

## Notes

- The initial readings and trend chart are illustrative demo values, not measurements from the hardware. When connected, the three top cards update with live readings; the trend chart remains illustrative because this static site does not save sensor history.
- The project overview is based on the supplied presentation: Spirulina cultivation, wastewater treatment, biomass use, renewable energy, biomedical applications, and IoT monitoring.
- The dashboard provides a simple HTTP integration contract; the ESP32 firmware still needs to implement `/api/sensors` and return current sensor readings.
- GitHub Pages can host the dashboard files, but it cannot make a private Wi-Fi ESP32 reachable from the public internet. Public live readings need a cloud endpoint or message broker.
