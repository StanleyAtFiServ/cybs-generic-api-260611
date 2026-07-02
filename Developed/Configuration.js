'use strict';

/**
 * Default merchant configuration using HTTP Signature authentication.
 *
 * Note: If you are currently using HTTP Signature authentication and want to migrate
 * to JWT (required for MLE support), you can now use JWT with the same shared secret
 * credentials (merchantKeyId + merchantsecretKey) you already have — no P12 certificate
 * needed. HTTP Signature is being deprecated; JWT with Shared Secret is the recommended
 * migration path.
 *
 * See JwtSharedSecretConfiguration for JWT with Shared Secret configuration,
 * which supports both Request MLE and Response MLE.
 *
 * @see {@link ./JwtSharedSecretConfiguration.js#getMerchantDetails}
 * @see {@link ./JwtSharedSecretConfiguration.js#getMerchantDetailsWithMLE}
 */

/*
* Merchant configuration properties are taken from Configuration module
*/
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// common parameters
const RunEnvironment = 'apitest.cybersource.com';
const MerchantId = process.env.ORGANIZATION_ID;

// http_signature parameters

class PemReader {

    constructor(filePath) {
      this.filePath = filePath;
      this.content = fs.readFileSync(filePath, 'utf8');
    }

    // Method to read the "Key" value
    readKey() {
      const match = this.content.match(/Key:(.+)/);
      return match ? match[1].trim() : null;
    }

  // Method to read the "Shared Secret Key" value, skipping BEGIN/END lines
    readSharedSecret() {
      const lines = this.content.split('\n');
      const secretLines = lines
        .filter(line =>
          !line.includes('BEGIN PUBLIC KEY') &&
          !line.includes('END PUBLIC KEY') &&
          !line.startsWith('Key:') &&
          !line.startsWith('Shared Secret Key')
        )
        .map(line => line.trim())
        .filter(line => line.length > 0);

      return secretLines.join('');
    }
}
const pemPath = path.resolve(__dirname, process.env.RESOURCE_DIR + process.env.HTTP_SIG_PEM_FILE + '.pem');
const reader = new PemReader(pemPath);

const MerchantKeyId = reader.readKey();
const MerchantSecretKey = reader.readSharedSecret();

// jwt parameters
const KeysDirectory = process.env.RESOURCE_DIR; // folder path for storing the key file (.p12 or .pem)
const KeyFileName = process.env.CERT_P12_FILE;  
const KeyAlias = 'testrest';
const KeyPass = process.env.CERT_P12_PASSWORD;

//meta key parameters
const UseMetaKey = false;
const PortfolioID = '';

// logging parameters
const EnableLog = true;
const LogFileName = 'cybs';
const LogDirectory = 'log';
const LogfileMaxSize = '5242880'; //10 MB In Bytes
const EnableMasking = true;

/*
PEM Key file path for decoding JWE Response Enter the folder path where the .pem file is located.
It is optional property, require adding only during JWE decryption.
*/
const PemFileDirectory = 'Resources/fiservhk_000005739184620001/NetworkTokenCert.pem';

//Add the property if required to override the cybs default developerId in all request body
const DefaultDeveloperId = '';

// Constructor for Configuration
function httpSigConfiguration() {

    var configObj = {
        'authenticationType': 'http_signature',
        'runEnvironment': RunEnvironment,

        'merchantID': MerchantId,
        'merchantKeyId': MerchantKeyId,
        'merchantsecretKey': MerchantSecretKey,

        'keyAlias': KeyAlias,
        'keyPass': KeyPass,
        'keyFileName': KeyFileName,
        'keysDirectory': KeysDirectory,

        'useMetaKey': UseMetaKey,
        'portfolioID': PortfolioID,
        'pemFileDirectory': PemFileDirectory,
        'defaultDeveloperId': DefaultDeveloperId,
        'logConfiguration': {
            'enableLog': EnableLog,
            'logFileName': LogFileName,
            'logDirectory': LogDirectory,
            'logFileMaxSize': LogfileMaxSize,
            'loggingLevel': 'debug',
            'enableMasking': EnableMasking
        }
    };
    return configObj;

}

function jwtConfiguration() {

    var configObj = {
        'authenticationType': 'JWT',
        'runEnvironment': RunEnvironment,

        'merchantID': MerchantId,
        'merchantKeyId': MerchantKeyId,
        'merchantsecretKey': MerchantSecretKey,

        'keyAlias': KeyAlias,
        'keyPass': KeyPass,
        'keyFileName': KeyFileName,
        'keysDirectory': KeysDirectory,

        'useMetaKey': UseMetaKey,
        'portfolioID': PortfolioID,
        'pemFileDirectory': PemFileDirectory,

        'logConfiguration': {
            'enableLog': EnableLog,
            'logFileName': LogFileName,
            'logDirectory': LogDirectory,
            'logFileMaxSize': LogfileMaxSize,
            'loggingLevel': 'debug',
            'enableMasking': EnableMasking
        },

        //Set Request MLE Settings in Merchant Configuration [Refer MLE.md on cybersource-rest-client-node github repo]
        'enableRequestMLEForOptionalApisGlobally': false, //Enables request MLE globally for all APIs that have optional MLE support //same as older deprecated variable "useMLEGlobally" //APIs that has MLE Request mandatory is default has MLE support in SDK without any configuration but support with JWT auth type.
        'requestMleKeyAlias':"CyberSource_SJC_US", //this is optional parameter, not required to set the parameter if custom value is not required for MLE key alias. Default value is "CyberSource_SJC_US". //same as older deprecated variable "mleKeyAlias"

        //Set Response MLE Settings in Merchant Configuration [Refer MLE.md on cybersource-rest-client-node github repo]
        'enableResponseMleGlobally': false, //Enables/Disable response MLE globally for all APIs that support MLE responses
        'responseMlePrivateKeyFilePath': "", //Path to the Response MLE private key file. Supported formats: .p12, .pfx, .pem, .key, .p8. Recommendation use encrypted private Key (password protection) for MLE response.
        'responseMlePrivateKeyFilePassword': "", //Password for the private key file (required for .p12/.pfx files or encrypted private keys).
        'responseMleKID': "" //This parameter is optional when responseMlePrivateKeyFilePath points to a CyberSource-generated P12 file. If not provided, the SDK will automatically fetch the Key ID from the P12 file. If provided, the SDK will use the user-provided value instead of the auto-fetched value.
        //Required when using PEM format files (.pem, .key, .p8) or when providing responseMlePrivateKey object directly.

    }; 
    return configObj;

}





module.exports = {
    httpSigConfiguration,
    jwtConfiguration
};
