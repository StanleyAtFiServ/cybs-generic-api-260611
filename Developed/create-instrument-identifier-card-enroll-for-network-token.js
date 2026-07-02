'use strict';

const args = require('minimist')(process.argv.slice(2));
var cybersourceRestApi = require('cybersource-rest-client');
require('dotenv').config();
var path = require('path');	
var configFile = args.config || 'Configuration.js'; // if node argument --config = 'Resources/852001001/Configuration.js' present, then load that input file
var filePath = path.resolve( configFile );
var { httpSigConfiguration } = require(filePath);


function create_instrument_identifier_card_enroll_for_network_token(callback) {
	var profileid = '93B32398-AD51-4CC2-A682-EA3E93614EB1';

	try {
		var configObject = new httpSigConfiguration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.PostInstrumentIdentifierRequest();

		requestObj.type = 'enrollable card';
		var card = new cybersourceRestApi.TmsEmbeddedInstrumentIdentifierCard();
		card.number = '4111111111111111';
		card.expirationMonth = '12';
		card.expirationYear = '2031';
		card.securityCode = '123';
		requestObj.card = card;

		var billTo = new cybersourceRestApi.TmsEmbeddedInstrumentIdentifierBillTo();
		billTo.address1 = 'A136, Tower 5, The Gateway';
		billTo.locality = 'Tsim Sha Tsui';
		billTo.administrativeArea = 'HK';
		billTo.postalCode = '00000';
		billTo.country = 'CN';
		requestObj.billTo = billTo;


	var opts = [];

		var instance = new cybersourceRestApi.InstrumentIdentifierApi(configObject, apiClient);

		instance.postInstrumentIdentifier(requestObj, opts, function (error, data, response) {
			if (error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Create an Instrument Identifier : ' + JSON.stringify(response['status']));
			var status = response['status'];
			write_log_audit(status);
			callback(error, data, response);
		});
	}
	catch (error) {
		console.log('\nException on calling the API : ' + error);
	}
}

function write_log_audit(status) {
	var filename = path.basename(__filename).split(".")[0];
	console.log(`[Sample Code Testing] [${filename}] ${status}`);
}

if (require.main === module) {
	create_instrument_identifier_card_enroll_for_network_token(function () {
		console.log('\nPostInstrumentIdentifier end.');
	});
}
module.exports.create_instrument_identifier_card_enroll_for_network_token = create_instrument_identifier_card_enroll_for_network_token;
