type Algorithms = 'ES384';

type OptionsObject = {
  algorithm: Algorithms;
  kid?: string;
  keyId?: string;
  expiresIn: number;
  issuer: string;
}

export declare function sign<D>(tokenDataObject: D, privateJwkAsBase64: string, options: OptionsObject): Promise<string>

export declare function verify<B>(jwt: string, publicJwkAsBase64: string, options: OptionsObject): Promise<B>

type DecodeReturn<B> = {
  body: B
  header: {
    alg: Algorithms;
    typ: 'JWT';
  }
}

export declare function decode<B>(jwt: string): DecodeReturn<B>
