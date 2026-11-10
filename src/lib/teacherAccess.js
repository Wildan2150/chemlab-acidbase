export const TEACHER_EMAIL = 'wildannashihin@gmail.com';

export function isTeacher(user) {
  return Boolean(user?.emailVerified === true && user.email?.toLowerCase() === TEACHER_EMAIL);
}
