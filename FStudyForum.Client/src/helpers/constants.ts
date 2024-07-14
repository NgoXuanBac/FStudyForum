export const Roles = {
  USER: "User",
  ADMIN: "Admin"
};
export const VoteTypes = {
  UNVOTE: 0,
  UP: 1,
  DOWN: -1
};

export const PHONE_EXP =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$|^$/;

export const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];
export const MAX_FILE_SIZE = 5000000;
export const LIMIT_SCROLLING_PAGNATION_RESULT = 4;
