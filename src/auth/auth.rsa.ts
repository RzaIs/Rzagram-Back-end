import { Injectable } from "@nestjs/common"
import { constants, generateKeyPairSync, privateDecrypt } from 'crypto'

@Injectable()
export class AuthRSAService {
  generateKeys(): { publicKey: string, privateKey: string} {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    })
    
    const validPublicKey = publicKey.replace(
      '-----BEGIN RSA PUBLIC KEY-----',
      ''
    ).replace(
      '-----END RSA PUBLIC KEY-----',
      ''
    ).replaceAll('\n', '')
    
    return {
      publicKey: validPublicKey,
      privateKey: privateKey
    }
  }

  decrypt(text: string, privateKey: string): string {
    const buffer = Buffer.from(text, "base64")
    const data = privateDecrypt({
      key: privateKey,
      padding: constants.RSA_PKCS1_PADDING
    }, buffer)
    return data.toString('utf-8')
  }
}