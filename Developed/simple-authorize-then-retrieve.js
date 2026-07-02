'use strict';

const args = require('minimist')(process.argv.slice(2));
var cybersourceRestApi = require('cybersource-rest-client');
require('dotenv').config();
var path = require('path');	
var configFile = args.config || 'Configuration.js'; // if node argument --config = 'Resources/852001001/Configuration.js' present, then load that input file
var filePath = path.resolve( configFile );
var { httpSigConfiguration } = require(filePath);
var processPayment = require('./simple-authorizationinternet');

function retrieve_transaction(callback) {
	try {
		var configObject = new httpSigConfiguration();
		var apiClient = new cybersourceRestApi.ApiClient();

		var instance = new cybersourceRestApi.TransactionDetailsApi(configObject, apiClient);

		processPayment.simple_authorization_internet(function (error, data, response) {
			if (data) {
				var id = data['id'];
				setTimeout(() => {	
					instance.getTransaction(id, function (error, data, response) {
						if (error) {
							console.log('\nError : ' + JSON.stringify(error));
						}
						else if (data) {
							console.log('\nData : ' + JSON.stringify(data));
						}

						console.log('\nResponse : ' + JSON.stringify(response));
						console.log('\nResponse Code of Retrieve a Transaction : ' + JSON.stringify(response['status']));
						var status = response['status'];
						write_log_audit(status);
						callback(error, data, response);
					}); 
				}, 20000);
			}
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
	retrieve_transaction(function () {
		console.log('\nGetTransaction end.');
	});
}
module.exports.retrieve_transaction = retrieve_transaction;
