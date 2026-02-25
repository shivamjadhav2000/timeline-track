# NPM Deploy Guide

Use this to publish a new version of `@shivamjadhav28/timeline-track`.

## 1) Authenticate

If your token expired or you changed 2FA settings, log in again with a **granular access token**.

Create a token on npmjs.com:
- Scope: `@shivamjadhav28`
- Permissions: **Read and Publish**
- 2FA: **bypass publish**

Then:

```bash
npm logout
npm login --auth-type=legacy
```

Login prompts:
- **Username:** `shivamjadhav28`
- **Password:** paste the token
- **Email:** your npm email

Verify:

```bash
npm whoami
```

## 2) Bump Version

You cannot re-publish the same version. Always bump:

```bash
npm version patch
```

Use `minor` or `major` when appropriate.

## 3) Build + Publish

```bash
npm run build
npm publish --access public
```

If you see a browser authentication URL, open it and approve.

## Troubleshooting

**403: You cannot publish over the previously published versions**
- You must bump the version (`npm version patch`) and retry.

**403: Two-factor authentication required**
- Use a granular access token with **bypass publish** enabled.

**E401: Incorrect or missing password**
- You likely used the wrong username or token. Log out and log in again.
