'use strict';

const args = require('minimist')(process.argv.slice(2));
var cybersourceRestApi = require('cybersource-rest-client');
require('dotenv').config();
var path = require('path');	
var configFile = args.config || 'Configuration.js'; // if node argument --config = 'Resources/852001001/Configuration.js' present, then load that input file
var filePath = path.resolve( configFile );
var { httpSigConfiguration } = require(filePath);

function cit_initiating_recurring_subscription(callback) {
	try {
		var configObject = new httpSigConfiguration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreatePaymentRequest();

		var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
		clientReferenceInformation.code = 'TC50171_3';
		requestObj.clientReferenceInformation = clientReferenceInformation;

		var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
		processingInformation.capture = false;
//		processingInformation.commerceIndicator = 'vbv';
		processingInformation.commerceIndicator = 'recurring_internet';
		
		var processingInformationAuthorizationOptions = new cybersourceRestApi.Ptsv2paymentsProcessingInformationAuthorizationOptions();
		processingInformationAuthorizationOptions.ignoreAvsResult = false;
		processingInformationAuthorizationOptions.ignoreCvResult = false;
		var processingInformationAuthorizationOptionsInitiator = new cybersourceRestApi.Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiator();
		processingInformationAuthorizationOptionsInitiator.credentialStoredOnFile = true;
		processingInformationAuthorizationOptions.initiator = processingInformationAuthorizationOptionsInitiator;

		processingInformation.authorizationOptions = processingInformationAuthorizationOptions;

		var processingInformationRecurringOptions = new cybersourceRestApi.Ptsv2paymentsProcessingInformationRecurringOptions();
		processingInformationRecurringOptions.loanPayment = false;
		processingInformationRecurringOptions.firstRecurringPayment = true;
		processingInformation.recurringOptions = processingInformationRecurringOptions;

		requestObj.processingInformation = processingInformation;

		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
// disable card info				var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
// disable card info				paymentInformationCard.number = '4111111111111111';
// disable card info				paymentInformationCard.expirationMonth = '12';
// disable card info				paymentInformationCard.expirationYear = '2031';
// disable card info		paymentInformation.card = paymentInformationCard;

		var paymentInformationInstrumentIdentifier = new cybersourceRestApi.Ptsv2paymentsPaymentInformationInstrumentIdentifier();
		paymentInformationInstrumentIdentifier.id = '53E252D043BE1FEBE063AF598E0AACB9';
		paymentInformation.instrumentIdentifier = paymentInformationInstrumentIdentifier;

		requestObj.paymentInformation = paymentInformation;

		var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = '100.00';
		orderInformationAmountDetails.currency = process.env.TXN_CURRENCY;
		orderInformation.amountDetails = orderInformationAmountDetails;

		// disable payment information bill		var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
		// disable payment information bill		orderInformationBillTo.firstName = 'John';
		// disable payment information bill		orderInformationBillTo.lastName = 'Doe';
		// disable payment information bill		orderInformationBillTo.address1 = '1 Market St';
		// disable payment information bill		orderInformationBillTo.locality = 'san francisco';
		// disable payment information bill		orderInformationBillTo.administrativeArea = 'CA';
		// disable payment information bill		orderInformationBillTo.postalCode = '94105';
		// disable payment information bill		orderInformationBillTo.country = 'US';
		// disable payment information bill		orderInformationBillTo.email = 'test@cybs.com';
		// disable payment information bill		orderInformationBillTo.phoneNumber = '4158880000';
		// disable payment information bill		orderInformation.billTo = orderInformationBillTo;

		requestObj.orderInformation = orderInformation;

		var consumerAuthenticationInformation = new cybersourceRestApi.Ptsv2paymentsConsumerAuthenticationInformation();
		consumerAuthenticationInformation.cavv = 'EHuWW9PiBkWvqE5juRwDzAUFBAk=';
		requestObj.consumerAuthenticationInformation = consumerAuthenticationInformation;


		var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);

		console.log('\n requestObj : \n' + JSON.stringify(requestObj, null, 2));
		instance.createPayment(requestObj, function (error, data, response) {
			if(error) {
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
	cit_initiating_recurring_subscription(function () {
		console.log('\nCreatePayment end.');
	});
}

module.exports.cit_initiating_recurring_subscription = cit_initiating_recurring_subscription;