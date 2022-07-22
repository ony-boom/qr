import Member from "../models/member";

export type Credential = "email" | "_id";

const isValidCredentials = async (
  credential: Credential,
  value: string
): Promise<boolean> => {
  let isValid = false;
  const result = await Member.findOne({ [credential]: value });
  if (result) isValid = true;
  return isValid;
};

export default isValidCredentials;
