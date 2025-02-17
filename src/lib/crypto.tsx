import nacl from "tweetnacl";
import util from "tweetnacl-util";

function generateKey(passphrase: string): Uint8Array {
  const hash = new TextEncoder().encode(passphrase);
  return nacl.hash(hash).slice(0, nacl.secretbox.keyLength);
}

const secretKey = generateKey("assist.id");

export const encrypt = (message: string): string => {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = util.decodeUTF8(message);
  const encrypted = nacl.secretbox(messageUint8, nonce, secretKey);

  return JSON.stringify([
    util.encodeBase64(nonce),
    util.encodeBase64(encrypted),
  ]);
};

export const decrypt = (cipherText: string): string | null => {
  try {
    const [nonce, encrypted] = JSON.parse(cipherText);
    const decrypted = nacl.secretbox.open(
      util.decodeBase64(encrypted),
      util.decodeBase64(nonce),
      secretKey
    );

    return decrypted ? util.encodeUTF8(decrypted) : null;
  } catch (error) {
    return null;
  }
};
