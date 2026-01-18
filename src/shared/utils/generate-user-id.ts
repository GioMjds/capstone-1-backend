export function generateUserId(): string {
  const alphabet: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortId: string = '';

  for (let idx = 0; idx < 12; idx++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    shortId += alphabet[randomIndex];
  }

  return shortId;
}
