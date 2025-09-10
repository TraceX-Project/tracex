// Image URL from Google often has size parameter at the end like =s96-c, =s128-c, etc.
// This function upgrades the size to the desired one.
// For example, if the URL is https://lh3.googleusercontent.com/a-/AOh14Gg=s96-c and we want size 256,
// it will return https://lh3.googleusercontent.com/a-/AOh14Gg=s256-c
export const upgradeGoogleAvatar = (url: string, size = 256) => {
  return url.replace(/=s\d+-c$/, `=s${size}-c`);
};
