'use strict';


const args = require('minimist')(process.argv.slice(2));
var cybersourceRestApi = require('cybersource-rest-client');
require('dotenv').config();
var path = require('path');	
var configFile = args.config || 'Configuration.js'; // if node argument --config = 'Resources/852001001/Configuration.js' present, then load that input file
var filePath = path.resolve( configFile );
var { httpSigConfiguration } = require(filePath);

function mit_recurring(callback) {
	try {
		var configObject = new httpSigConfiguration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreatePaymentRequest();

		var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
		clientReferenceInformation.code = 'TC50171_3';
		requestObj.clientReferenceInformation = clientReferenceInformation;

		var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
		processingInformation.capture = false;
		processingInformation.commerceIndicator = 'recurring';
		var processingInformationAuthorizationOptions = new cybersourceRestApi.Ptsv2paymentsProcessingInformationAuthorizationOptions();
		processingInformationAuthorizationOptions.ignoreAvsResult = false;
		processingInformationAuthorizationOptions.ignoreCvResult = false;
		var processingInformationAuthorizationOptionsInitiator = new cybersourceRestApi.Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiator();
		processingInformationAuthorizationOptionsInitiator.type = 'merchant';
		processingInformationAuthorizationOptionsInitiator.storedCredentialUsed = true;
		var processingInformationAuthorizationOptionsInitiatorMerchantInitiatedTransaction = new cybersourceRestApi.Ptsv2paymentsProcessingInformationAuthorizationOptionsInitiatorMerchantInitiatedTransaction();
		processingInformationAuthorizationOptionsInitiatorMerchantInitiatedTransaction.previousTransactionId = '123456789012345';
		processingInformationAuthorizationOptionsInitiator.merchantInitiatedTransaction = processingInformationAuthorizationOptionsInitiatorMerchantInitiatedTransaction;

		processingInformationAuthorizationOptions.initiator = processingInformationAuthorizationOptionsInitiator;

		processingInformation.authorizationOptions = processingInformationAuthorizationOptions;

		requestObj.processingInformation = processingInformation;

		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
		var paymentInformationCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
		paymentInformationCard.number = '4111111111111111';
		paymentInformationCard.expirationMonth = '12';
		paymentInformationCard.expirationYear = '2031';
		paymentInformationCard.type = '001';
		paymentInformation.card = paymentInformationCard;

		requestObj.paymentInformation = paymentInformation;

		var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = '102.21';
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

		console.log('\n requestObj : \n' + JSON.stringify(requestObj, null, 2));
		var instance = new cybersourceRestApi.PaymentsApi(configObject, apiClient);

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
	mit_recurring(function () {
		console.log('\nCreatePayment end.');
	});
}

module.exports.mit_recurring = mit_recurring;