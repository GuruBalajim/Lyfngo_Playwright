import fs from "fs";
import crypto from "crypto";

export class ApiInterceptor {
  constructor(page, testInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.logs = [];
    this.isCapturing = false;

    this._initListeners();
  }

  // -------------------------------------------------------------------
  //  EVENT LISTENERS
  // -------------------------------------------------------------------
  _initListeners() {
    // ---------------------- REQUEST CAPTURE ----------------------
    this.page.on("request", (req) => {
      if (!this.isCapturing) return;

      const url = req.url();
      const method = req.method();

      if (this._isIgnored(url)) return;
      if (!this._isAllowedApi(url)) return;

      const rawPayload = req.postData();      // encrypted payload
      const ivHeader = req.headers()["iv"];   // iv from header

      let decryptedPayload = rawPayload;

      if (rawPayload && ivHeader) {
        decryptedPayload = this._decryptAES(rawPayload, ivHeader);
      }

      this.logs.push({
        url,
        method,
        rawPayload,
        payload: decryptedPayload,
        status: null,
        response: null,
        timestamp: Date.now(),
      });
    });

    // ---------------------- RESPONSE CAPTURE ----------------------
    this.page.on("response", async (res) => {
      if (!this.isCapturing) return;

      const url = res.url();
      const req = res.request();
      const method = req.method();

      if (this._isIgnored(url)) return;
      if (!this._isAllowedApi(url)) return;

      const entry = this.logs.find(
        (l) =>
          l.url === url &&
          l.method === method &&
          l.status === null
      );

      if (!entry) return;

      entry.status = res.status();

      try {
        // try JSON
        entry.response = await res.json();
      } catch {
        try {
          // fallback text
          entry.response = await res.text();
        } catch {
          entry.response = "Unable to read response";
        }
      }
    });
  }

  // -------------------------------------------------------------------
  //  AES DECRYPT FUNCTION
  // -------------------------------------------------------------------
  _decryptAES(encryptedBase64, ivHex) {
    try {
      const key = Buffer.from("mkoji8u7y6tgfdsxvb65tgfdre43wert", "utf8");
      const iv = Buffer.from(ivHex, "hex");

      const encrypted = Buffer.from(encryptedBase64, "base64");

      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

      let decrypted = decipher.update(encrypted, "base64", "utf8");
      decrypted += decipher.final("utf8");

      return JSON.parse(decrypted);
    } catch (error) {
      return `[DECRYPTION FAILED] ${error.message}`;
    }
  }

  // -------------------------------------------------------------------
  // CONTROL METHODS
  // -------------------------------------------------------------------
  startCapture() {
    this.logs = [];
    this.isCapturing = true;
  }

  stopCapture() {
    this.isCapturing = false;
    return this.logs;
  }

  // -------------------------------------------------------------------
  // SAVE REPORT FILE
  // -------------------------------------------------------------------
  async saveFiles(filename = "api-log") {
    const folder = "src/reports/api";

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const filePath = `${folder}/${filename}-${Date.now()}.json`;

    fs.writeFileSync(filePath, JSON.stringify(this.logs, null, 2), "utf-8");

    console.log(`✅ API log saved: ${filePath}`);

    // Attach in Playwright report
    if (this.testInfo) {
      await this.testInfo.attach("API Log Report", {
        body: JSON.stringify(this.logs, null, 2),
        contentType: "application/json",
      });
    }
  }

  // -------------------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------------------
  _isIgnored(url) {
    return (
      url.endsWith(".css") ||
      url.endsWith(".js") ||
      url.endsWith(".png") ||
      url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.includes("fonts") ||
      url.includes("favicon")
    );
  }

  _isAllowedApi(url) {
    return (
      url.includes("/api") ||
       url.includes("/files") ||
      url.includes("calendarSocket") ||
      url.includes("saveUserLoginTime")
    );
  }
}
