import axios from 'axios';
import { createLogger } from '../../utils/logger';

const logger = createLogger('jwks');

async function getSigningKeys(): Promise<any[]> {    
    try {
        let keys = [];
        // Retrieve the JWKS and filter for potential signing keys.
        logger.debug('getting the stuff')
        try {
            const {data} = await axios.get('https://dev-udacity-ben.auth0.com/.well-known/jwks.json')
            logger.debug(JSON.stringify(data));
            keys = data.keys
        } catch (e) {
            logger.error(`ok got an error: ${e.message}`);
            if (e.response) {
                logger.error(`ok got an error response: ${e.response.data}`);
                logger.error(`ok got an error status: ${e.response.status}`);
            }
        }
    
        if (!keys || !keys.length) {
            logger.error('no keys in therr')
            return []
        }

        logger.debug(`keys: ${JSON.stringify(keys)}`)
        return keys.filter(key => key.use === 'sig' 
            && key.kty === 'RSA' 
            && key.kid           
            && ((key.x5c && key.x5c.length) || (key.n && key.e)) 
        ).map(key => {
            // 5. Using the x5c property build a certificate which will be used to verify the JWT signature. (it was prebuilt)
            return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
        });
    } catch (e) {
        logger.error(e)
        return []
    }
}

const getSigningKey = (kid, keys) => {
    // Find the signing key in the filtered JWKS with a matching kid property.
    logger.debug(`kid: ${JSON.stringify(kid)}`)
    logger.debug(`signingKeys Collection: ${JSON.stringify(keys)}`)
    return keys.find(key => key.kid === kid);
}
  
// 2.Extract the JWT from the request's authorization header
export async function secretProvider(decodedJwt) {
    // Only RS256 is supported.
    if (!decodedJwt || decodedJwt.alg !== 'RS256') {
        return null;
    }
    
    let signingKeys = await getSigningKeys();
    logger.info(decodedJwt.kid);
    logger.info(JSON.stringify(signingKeys));
    // 3. Decode the JWT and grab the kid property from the header.
    let key = getSigningKey(decodedJwt.kid, signingKeys)

    // Provide the key.
    return key.publicKey || key.rsaPublicKey;
};

export function certToPEM(cert: string): string {
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
}
