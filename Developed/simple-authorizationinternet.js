'use strict';

const args = require('minimist')(process.argv.slice(2));
var cybersourceRestApi = require('cybersource-rest-client');
require('dotenv').config();
var path = require('path');	
var configFile = args.config || 'Configuration.js'; // if node argument --config = 'Resources/852001001/Configuration.js' present, then load that input file
var filePath = path.resolve( configFile );
var { httpSigConfiguration } = require(filePath);

function simple_authorization_internet(callback, enable_capture) {
	try {
		var configObject = new httpSigConfiguration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreatePaymentRequest();

		var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
		clientReferenceInformation.code = 'TC50171_3';
		requestObj.clientReferenceInformation = clientReferenceInformation;

		var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
		processingInformation.capture = false;
		if (enable_capture === true) {
			processingInformation.capture = true;
		}

		requestObj.processingInformation = processingInformation;

		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
		var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
		paymentInformationCard.number = '4111111111111111';
		paymentInformationCard.expirationMonth = '12';
		paymentInformationCard.expirationYear = '2031';
		paymentInformation.card = paymentInformationCard;

		requestObj.paymentInformation = paymentInformation;

		var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = '50.00';
		orderInformationAmountDetails.currency = process.env.TXN_CURRENCY;
		orderInformation.amountDetails = orderInformationAmountDetails;

		var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
		orderInformationBillTo.firstName = 'Paul';
		orderInformationBillTo.lastName = 'Maesor';
		orderInformationBillTo.address1 = 'A136, Tower 5, The Gateway';
		orderInformationBillTo.locality = 'Tsim Sha Tsui';
		orderInformationBillTo.administrativeArea = 'HK';
		orderInformationBillTo.postalCode = '00000';
		orderInformationBillTo.country = 'CN';
		orderInformationBillTo.email = 'paul.maesor@fiserv.com';
		orderInformationBillTo.phoneNumber = '+852 30715008';
		orderInformation.billTo = orderInformationBillTo;
		

		requestObj.orderInformation = orderInformation;


		var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);

		instance.createPayment(requestObj, function (error, data, response) {
			if (error) {
				console.log('\nError : ' + JSON.stringify(error));
			}
			else if (data) {
				console.log('\nData : ' + JSON.stringify(data));
			}

			console.log('\nResponse : ' + JSON.stringify(response));
			console.log('\nResponse Code of Process a Payment : ' + JSON.stringify(response['status']));
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
	simple_authorization_internet(function () {
		console.log('\nCreatePayment end.');
	});
}
module.exports.simple_authorization_internet = simple_authorization_internet;
