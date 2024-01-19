export const API_URL =  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/"
export const LOGIN_TOKEN =  "LOGIN_TOKEN";
export const ROLES = {
    SUPER_ADMIN_ROLE:"super-admin" ,
    ADMIN_ROLE:"admin",
    MANAGER_ROLE:"manager",  
    USER_ROLE:"user",
    ANONYMOUS_ROLE:"anonymous" 
}
export const ROW_PER_PAGE =  10;
export const MAX_ROW_PER_PAGE =  100;
export const INIT_PAGE =  0;
export const filter_characters = [
    "All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M","N", "O", "P", "R", "S", "T", "U", "V","W", "X", "Y", "Z", "123"
  ]
