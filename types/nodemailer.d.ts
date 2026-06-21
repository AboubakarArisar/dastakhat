// Minimal ambient declaration: the runtime package ships no bundled types and
// @types/nodemailer isn't installed. This keeps the email route type-clean.
declare module "nodemailer";
