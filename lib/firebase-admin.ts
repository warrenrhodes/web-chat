import * as admin from "firebase-admin";
import { Database } from "@spreeloop/database";
import { initializeApp, getApps, cert } from "firebase-admin/app";

const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: "web-chat-af6c1",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const backend = {
  database: Database.createFirestore(admin.firestore()) as Database,
  adminDb: admin.firestore(),
};
