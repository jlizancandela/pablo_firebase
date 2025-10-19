'use client';
import { getUser } from './auth/get-user';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  constructor({
    path,
    operation,
    requestResourceData,
  }: SecurityRuleContext) {
    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
    `;
    const cause = {
      context: {
        request: {
          auth: getUser() ?? { uid: null, token: null },
          method: operation,
          path: `/databases/(default)/documents/${path}`,
          resource: {
            data: requestResourceData,
          },
        },
      },
    };
    super(message, { cause });
    this.name = 'FirestorePermissionError';
  }
}
