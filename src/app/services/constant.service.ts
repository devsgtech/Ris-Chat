export enum IMG {
  LoginImg            = 'assets/login1.svg',
  AppLogo             = 'assets/logo1.svg',
  UserName            = 'assets/Username.svg',
  PasswordLockIcon    = 'assets/password.svg',
  SEND_MESSAGE        = 'assets/send.svg',
  DOUBLE_TICK         = 'assets/double-tick-black.svg',
  ChatIcon            = 'assets/chaticon.svg',
  Setting             = 'assets/setting.svg',
}

export enum FILE_VAR {
  MULTIPLE_SELECT_DEFAULT           = 5,
  MULTIPLE_SELECT                   = 5,
  MAX_SIZE_MB                       = 2,
  MAX_LIMIT                         = 500,
  MAX_FILE_SIZE_DEFAULT             = 2097,
  MAX_FILE_SIZE_DEFAULT1             = 20970000,
  CoverPhotoFileSize                = 1048576,
  JourneyPhotoFileSize              = 10485760,
  JourneyFileSize                   = 10485760,
  MAX_FILE_SIZE_5                   = 5242880,
  MaxFileSize                       = 524288000,
  MAX_FILE_SIZE_10                  = 10485760,
  MAX_FILE_SIZE_20                  = 20971520,
  JourneyPhotoHintHeader            = 'Max upload size 10 MB. **Allowed Image formats : jpg ,jpeg ',
  ALLOWED_FILE_TYPE                 = 'image/jpeg,image/jpg,image/png,image/pjepg',
  IMG_FILE_TYPE                     = 'image/jpeg,image/jpg,image/png,image/gif',
  CoverPhotoFileType                = 'image/jpeg,image/jpg,image/png,image/gif',
  JourneyPhotoFileType              = 'image/jpeg,image/jpg,image/png,image/gif',
  JourneyFileType                   = 'application/pdf,application/doc,application/docx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  OTHER_FILE_TYPE                   = 'image/jpeg,image/jpg,image/png,application/pdf',
  SUB_HEADER1                       = '**Allowed - jpeg, jpg, png, gif, pjepg, tiff, pdf, msword.',
  SUB_HEADER2                       = '**Allowed - jpeg, jpg, png, gif. MaxSize - 10 MB. Max 10 file(Choose from gallery).',
  SUB_HEADER                        = '**Allowed - jpg ,jpeg, png, gif. MaxSize - 2 MB.',
}

export enum VALIDATION_MSG {
  ERR_REQUIRED_FIELD = "*You must enter a value.",
  ERR_EMAIL_FIELD = "*Please enter a valid email.",
  INVALID_EMAIL = '*Invalid email',
  INVALID_PASSWORD = '*Invalid password',
  INVALID_USERNAME = '*Invalid username',
  INVALID_DESCRIPTION = '*Invalid description',
  PASSWORD = "*Password doesn't match",
  PASSWORD_LENGTH = "*Your password must be have at least 6 characters long",
  ERR_EMAIL_PATTERN = "*Email format is not correct",
  ERR_NUMERIC_ONLY = "*Only Numeric Values Allowed",
  ERR_LOGOUT = "Logged out.",
  ERR_MIN_ONE = "*Minimum value should be 1", 
  CARD_VAL = "*Please enter a valid input",
  MONTH_VAL = "*Value should start with 0 if less than 10", 
  SIGNED_NAME = "*Minimum 3 characters required.",
  ERR_PERMISSION_ALLOW = 'Please allow camera permissions.',
  ERR_FILE_TYPE                       = 'File type not allowed!',
  ERR_FILE_SIZE                       = 'File size not allowed!',
  ERR_FILE_SIZE_AND_TYPE              = 'One or more file(s) SIZE or TYPE not allowed!',
}

export const firebaseConfig = { 
  apiKey: "AIzaSyBJq_BGEwT2SGANp0eIRhCatwmeOMYmuUw",
  authDomain: "chat-app-e0bcd.firebaseapp.com",
  databaseURL: "https://chat-app-e0bcd-default-rtdb.firebaseio.com",
  projectId: "chat-app-e0bcd",
  storageBucket: "chat-app-e0bcd.appspot.com",
  messagingSenderId: "39501495642",
  appId: "1:39501495642:web:974d133ffcb0ff7103c763",
  measurementId: "G-Q3B25BER7X"
};

export enum VARS {
  USER_DATA                                   = 'USER_DATA',
  IS_USER_LOGGED_IN                           = 'IS_USER_LOGGED_IN',
}

export let USER_DETAILS: any = {
  DATA: undefined
};