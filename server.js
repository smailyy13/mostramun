const { Buffer } = require("node:buffer");
const { createServer } = require("node:http");
const { mkdirSync } = require("node:fs");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const DB_PATH = path.join(DATA_DIR, "mostramun.db");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3000);
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const JSON_BODY_LIMIT = 1024 * 1024;

const COMMITTEE_OPTIONS = new Set([
  "LEGAL",
  "SOCHUM",
  "UNWOMEN",
  "IAAP",
  "EGM",
  "FIA",
  "US Federal Court",
  "House of Commons",
  "European Parliament",
  "SUMMIT",
  "H-UNSC",
  "HCC",
  "Board of Peace",
  "FJCC",
  "FCC",
  "JCC"
]);

const GENDER_OPTIONS = new Set(["Male", "Female", "Prefer not to say"]);
const GRADE_OPTIONS = new Set(["Preparatory", "9.Grade", "10.Grade", "11.Grade", "12.Grade"]);

mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS delegate_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submittedAt TEXT NOT NULL,
    agreementAccepted INTEGER NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    gender TEXT NOT NULL,
    institution TEXT NOT NULL,
    grade TEXT NOT NULL,
    nationality TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    identityNumber TEXT NOT NULL,
    healthNotes TEXT NOT NULL,
    foodPreference TEXT NOT NULL,
    experiences TEXT NOT NULL,
    firstCommitteePreference TEXT NOT NULL,
    secondCommitteePreference TEXT NOT NULL,
    thirdCommitteePreference TEXT NOT NULL,
    committeeContribution TEXT NOT NULL,
    participationMotivation TEXT NOT NULL,
    additionalNotes TEXT NOT NULL DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS idx_delegate_applications_submittedAt
    ON delegate_applications (submittedAt DESC);

  CREATE INDEX IF NOT EXISTS idx_delegate_applications_email
    ON delegate_applications (email);
`);

const insertApplicationStatement = db.prepare(`
  INSERT INTO delegate_applications (
    submittedAt,
    agreementAccepted,
    name,
    surname,
    gender,
    institution,
    grade,
    nationality,
    email,
    phone,
    identityNumber,
    healthNotes,
    foodPreference,
    experiences,
    firstCommitteePreference,
    secondCommitteePreference,
    thirdCommitteePreference,
    committeeContribution,
    participationMotivation,
    additionalNotes
  ) VALUES (
    @submittedAt,
    @agreementAccepted,
    @name,
    @surname,
    @gender,
    @institution,
    @grade,
    @nationality,
    @email,
    @phone,
    @identityNumber,
    @healthNotes,
    @foodPreference,
    @experiences,
    @firstCommitteePreference,
    @secondCommitteePreference,
    @thirdCommitteePreference,
    @committeeContribution,
    @participationMotivation,
    @additionalNotes
  )
`);

const listApplicationsStatement = db.prepare(`
  SELECT
    id,
    submittedAt,
    agreementAccepted,
    name,
    surname,
    gender,
    institution,
    grade,
    nationality,
    email,
    phone,
    identityNumber,
    healthNotes,
    foodPreference,
    experiences,
    firstCommitteePreference,
    secondCommitteePreference,
    thirdCommitteePreference,
    committeeContribution,
    participationMotivation,
    additionalNotes
  FROM delegate_applications
  ORDER BY submittedAt DESC, id DESC
`);

const statsStatement = db.prepare(`
  SELECT
    COUNT(*) AS totalApplications,
    COUNT(DISTINCT institution) AS uniqueInstitutions,
    COUNT(DISTINCT nationality) AS uniqueNationalities,
    MAX(submittedAt) AS latestSubmission
  FROM delegate_applications
`);

const topCommitteeStatement = db.prepare(`
  SELECT
    firstCommitteePreference AS committee,
    COUNT(*) AS total
  FROM delegate_applications
  GROUP BY firstCommitteePreference
  ORDER BY total DESC, committee ASC
  LIMIT 3
`);

function normalizeLineBreaks(value) {
  return typeof value === "string" ? value.replace(/\r\n?/g, "\n") : "";
}

function sanitizeInline(value) {
  return normalizeLineBreaks(value).replace(/\s+/g, " ").trim();
}

function sanitizeMultiline(value) {
  return normalizeLineBreaks(value).trim();
}

function countWords(text) {
  return sanitizeMultiline(text).split(/\s+/).filter(Boolean).length;
}

function validateMaxLength(value, maxLength) {
  return value.length <= maxLength;
}

function serializeApplication(row) {
  return {
    ...row,
    agreementAccepted: Boolean(row.agreementAccepted)
  };
}

function validateDelegateApplication(payload) {
  const phone = sanitizeInline(payload.phone).replace(/\D+/g, "");
  const identityNumber = sanitizeInline(payload.identityNumber).replace(/\s+/g, "").toUpperCase();
  const nationalitySelection = sanitizeInline(payload.nationality);
  const nationalityOther = sanitizeInline(payload.nationalityOther);
  const nationality =
    nationalitySelection === "Other" ? nationalityOther : nationalitySelection;

  const application = {
    submittedAt: new Date().toISOString(),
    agreementAccepted: payload.agreementAccepted === true,
    name: sanitizeInline(payload.name),
    surname: sanitizeInline(payload.surname),
    gender: sanitizeInline(payload.gender),
    institution: sanitizeInline(payload.institution),
    grade: sanitizeInline(payload.grade),
    nationality,
    email: sanitizeInline(payload.email).toLowerCase(),
    phone,
    identityNumber,
    healthNotes: sanitizeMultiline(payload.healthNotes),
    foodPreference: sanitizeMultiline(payload.foodPreference),
    experiences: sanitizeMultiline(payload.experiences),
    firstCommitteePreference: sanitizeInline(payload.firstCommitteePreference),
    secondCommitteePreference: sanitizeInline(payload.secondCommitteePreference),
    thirdCommitteePreference: sanitizeInline(payload.thirdCommitteePreference),
    committeeContribution: sanitizeMultiline(payload.committeeContribution),
    participationMotivation: sanitizeMultiline(payload.participationMotivation),
    additionalNotes: sanitizeMultiline(payload.additionalNotes)
  };

  const errors = {};

  if (!application.agreementAccepted) {
    errors.agreementAccepted = "You must accept the participant commitment form.";
  }

  if (!application.name) errors.name = "Name is required.";
  if (!application.surname) errors.surname = "Surname is required.";
  if (!GENDER_OPTIONS.has(application.gender)) errors.gender = "Please select a valid gender.";
  if (!application.institution) errors.institution = "Institution / School is required.";
  if (!GRADE_OPTIONS.has(application.grade)) errors.grade = "Please select a valid grade.";
  if (!application.nationality) errors.nationality = "Nationality is required.";

  if (!application.email) {
    errors.email = "E-mail address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) {
    errors.email = "Please enter a valid e-mail address.";
  }

  if (!application.phone) {
    errors.phone = "Phone number is required.";
  } else if (!/^\d{10,15}$/.test(application.phone)) {
    errors.phone = "Phone number must contain only digits and be 10 to 15 digits long.";
  }

  if (!application.identityNumber) {
    errors.identityNumber = "Turkish Republic ID / Passport Number is required.";
  } else if (!/^[A-Z0-9-]{5,20}$/.test(application.identityNumber)) {
    errors.identityNumber =
      "Please enter a valid Turkish Republic ID / Passport Number.";
  }

  if (!application.healthNotes) errors.healthNotes = "Please fill in the health notes field.";
  if (!application.foodPreference) {
    errors.foodPreference = "Please fill in the special food preference field.";
  }
  if (!application.experiences) errors.experiences = "Experience information is required.";

  const preferences = [
    application.firstCommitteePreference,
    application.secondCommitteePreference,
    application.thirdCommitteePreference
  ];

  if (!COMMITTEE_OPTIONS.has(application.firstCommitteePreference)) {
    errors.firstCommitteePreference = "Please select a valid first committee preference.";
  }
  if (!COMMITTEE_OPTIONS.has(application.secondCommitteePreference)) {
    errors.secondCommitteePreference = "Please select a valid second committee preference.";
  }
  if (!COMMITTEE_OPTIONS.has(application.thirdCommitteePreference)) {
    errors.thirdCommitteePreference = "Please select a valid third committee preference.";
  }
  if (new Set(preferences).size !== preferences.length) {
    errors.secondCommitteePreference = "Committee preferences must all be different.";
    errors.thirdCommitteePreference = "Committee preferences must all be different.";
  }

  if (!application.committeeContribution) {
    errors.committeeContribution = "Please answer the committee contribution question.";
  } else if (countWords(application.committeeContribution) < 250) {
    errors.committeeContribution = "This answer must contain at least 250 words.";
  }

  if (!application.participationMotivation) {
    errors.participationMotivation = "Please answer the participation question.";
  } else if (countWords(application.participationMotivation) < 100) {
    errors.participationMotivation = "This answer must contain at least 100 words.";
  }

  const maxLengths = {
    name: 120,
    surname: 120,
    institution: 180,
    nationality: 80,
    email: 180,
    phone: 15,
    identityNumber: 20,
    healthNotes: 2000,
    foodPreference: 1000,
    experiences: 4000,
    committeeContribution: 12000,
    participationMotivation: 8000,
    additionalNotes: 4000
  };

  Object.entries(maxLengths).forEach(([field, maxLength]) => {
    if (!validateMaxLength(application[field], maxLength)) {
      errors[field] = `This field must be ${maxLength} characters or fewer.`;
    }
  });

  return {
    application,
    errors
  };
}

function getStats() {
  const summary = statsStatement.get();
  const topFirstPreferences = topCommitteeStatement.all();

  return {
    totalApplications: Number(summary.totalApplications || 0),
    uniqueInstitutions: Number(summary.uniqueInstitutions || 0),
    uniqueNationalities: Number(summary.uniqueNationalities || 0),
    latestSubmission: summary.latestSubmission || null,
    topFirstPreferences
  };
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function isInsideRoot(filePath) {
  const relative = path.relative(ROOT_DIR, filePath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function serveStaticFile(res, pathname) {
  const relativePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(ROOT_DIR, `.${relativePath}`);

  if (!isInsideRoot(filePath)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml"
  };

  try {
    const file = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream"
    });
    res.end(file);
  } catch (error) {
    sendText(res, 404, "Not found");
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > JSON_BODY_LIMIT) {
        reject(new Error("Request body is too large."));
        req.destroy();
        return;
      }

      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const rawBody = Buffer.concat(chunks).toString("utf-8");
        resolve(rawBody ? JSON.parse(rawBody) : {});
      } catch (error) {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });
}

function parseBasicAuthHeader(header = "") {
  if (!header.startsWith("Basic ")) return null;

  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf-8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return null;

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1)
    };
  } catch (error) {
    return null;
  }
}

function authorizeAdmin(req, res) {
  if (!ADMIN_PASSWORD) {
    sendJson(res, 503, {
      error: "Admin access is disabled. Set ADMIN_USERNAME and ADMIN_PASSWORD in .env."
    });
    return false;
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization);
  const authorized =
    credentials &&
    credentials.username === ADMIN_USERNAME &&
    credentials.password === ADMIN_PASSWORD;

  if (!authorized) {
    sendJson(
      res,
      401,
      { error: "Authentication required." },
      { "WWW-Authenticate": 'Basic realm="MOSTRAMUN Admin"' }
    );
    return false;
  }

  return true;
}

function buildCsv(rows) {
  const headers = [
    "id",
    "submittedAt",
    "name",
    "surname",
    "gender",
    "institution",
    "grade",
    "nationality",
    "email",
    "phone",
    "identityNumber",
    "healthNotes",
    "foodPreference",
    "experiences",
    "firstCommitteePreference",
    "secondCommitteePreference",
    "thirdCommitteePreference",
    "committeeContribution",
    "participationMotivation",
    "additionalNotes"
  ];

  const escapeCell = (value) => `"${String(value ?? "").replace(/"/g, "\"\"")}"`;
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(","))
  ];

  return lines.join("\n");
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
  const { pathname } = url;

  if (req.method === "GET" && pathname === "/api/admin/stats") {
    if (!authorizeAdmin(req, res)) return;
    sendJson(res, 200, getStats());
    return;
  }

  if (req.method === "GET" && pathname === "/api/admin/delegate-applications") {
    if (!authorizeAdmin(req, res)) return;
    const applications = listApplicationsStatement.all().map(serializeApplication);
    sendJson(res, 200, { applications });
    return;
  }

  if (req.method === "GET" && pathname === "/api/admin/delegate-applications.csv") {
    if (!authorizeAdmin(req, res)) return;
    const applications = listApplicationsStatement.all().map(serializeApplication);
    sendText(
      res,
      200,
      buildCsv(applications),
      "text/csv; charset=utf-8"
    );
    return;
  }

  if (req.method === "POST" && pathname === "/api/delegate-applications") {
    let payload;

    try {
      payload = await parseJsonBody(req);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }

    const { application, errors } = validateDelegateApplication(payload);
    if (Object.keys(errors).length > 0) {
      sendJson(res, 422, { errors });
      return;
    }

    const insertResult = insertApplicationStatement.run({
      ...application,
      agreementAccepted: application.agreementAccepted ? 1 : 0
    });

    sendJson(res, 201, {
      message: "Application received successfully.",
      applicationId: Number(insertResult.lastInsertRowid)
    });
    return;
  }

  if (req.method === "GET" && pathname === "/admin") {
    await serveStaticFile(res, "/admin.html");
    return;
  }

  if (req.method === "GET" && pathname === "/delegate") {
    await serveStaticFile(res, "/delegate.html");
    return;
  }

  if (req.method === "GET" && (pathname === "/" || pathname === "/index.html" || pathname === "/delegate.html" || pathname === "/styles.css" || pathname === "/script.js" || pathname === "/admin.html" || pathname === "/admin.js" || pathname.startsWith("/assets/"))) {
    await serveStaticFile(res, pathname);
    return;
  }

  sendText(res, 404, "Not found");
}

const server = createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    console.error(error);
    sendJson(res, 500, { error: "Internal server error." });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`MOSTRAMUN site running at http://${HOST}:${PORT}`);
  console.log(`SQLite database: ${DB_PATH}`);

  if (ADMIN_PASSWORD) {
    console.log(`Admin panel: http://${HOST}:${PORT}/admin`);
    console.log(`Admin username: ${ADMIN_USERNAME}`);
  } else {
    console.log("Admin panel is disabled until ADMIN_PASSWORD is set in .env");
  }
});
