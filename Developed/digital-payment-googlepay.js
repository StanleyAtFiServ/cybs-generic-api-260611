'use strict';

const args = require('minimist')(process.argv.slice(2));
var cybersourceRestApi = require('cybersource-rest-client');
require('dotenv').config();
var path = require('path');	
var configFile = args.config || 'Configuration.js'; // if node argument --config = 'Resources/852001001/Configuration.js' present, then load that input file
var filePath = path.resolve( configFile );
var { httpSigConfiguration } = require(filePath);

function digital_payment_googlepay(callback, enable_capture) {
	try {
		var configObject = new httpSigConfiguration();
		var apiClient = new cybersourceRestApi.ApiClient();
		var requestObj = new cybersourceRestApi.CreatePaymentRequest();

		var clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
		clientReferenceInformation.code = 'CODE_1231223';
		requestObj.clientReferenceInformation = clientReferenceInformation;

		var processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
		processingInformation.capture = true;
/*
		if (enable_capture === true) {
			requestObj.processingInformation.capture = true;
		}
			*/ 
		processingInformation.paymentSolution = '012';
		requestObj.processingInformation = processingInformation;

		var paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
		var paymentInformationFluidData	= new cybersourceRestApi.Ptsv2paymentsPaymentInformationFluidData();
		paymentInformationFluidData.value = "eyJzaWduYXR1cmUiOiJNRVlDSVFEWDJKSTNUQnJ5YTNNbElhbzdLOFArdUp5ZE1sNFhKdDhQYzdNNTEwNkR4QUloQU9sOU0vVHZDWDdrOE5LOTIyNHB3Z2JsclRDNktlMFBlL2tNOVhvNDFsdEIiLCJwcm90b2NvbFZlcnNpb24iOiJFQ3YxIiwic2lnbmVkTWVzc2FnZSI6IntcImVuY3J5cHRlZE1lc3NhZ2VcIjpcInJDYUdXN2JHbXliSTgxcnptUHMxWDlIVFVNUTNwZHpJQW9nYjJoTWF1WTg5aGxYZ21MbUdtL0twS3VsL012eEFhUGhVTVQxN00yeURDVVpCZWE4UFJCdG0zVDBpTEpmbDcyTUlicUVsQ3pvdzJ0NUhGaVJha1dWbGJwNGtkUGNrQVNCRXh1RlVsVzZkWHZTYlBtalE2NGx4azF2WkhBSFF0T2lTOFNMNEczRGFYNUxkaFAxaU5lT1laNlFPUzkycTNvekdNSUZnckl3ZHRQSVdTclBJSGhSbjRYMldRK2FqaUhpNUIySlZWVzVLWGdLWS9uN2xrMDcrRUk3R2NNeWcrVitVZjFNWXI1Z2Y1Qi9NWWJ4TzNkTW1wZVRjNFRKUldsMkpwSU42NVZRSEZ2NkJYcWhCYWdJSkRUbDB6NHFRTktYS29uOEVyT2ZtNStKbXJNNENtbjU4OTRnS2dLbk4remNYN3ZLNXdqLzZkWFpYV2hrYk9CcFVXeHBtT1had0pSS1kvT0pKai9XTXFFRllVMWZ1L0hnV25Ma0J5MlVDNnFIaVlsQUNnWWpoWVlTWXQ1bmJCaTFSaFI3VVwiLFwiZXBoZW1lcmFsUHVibGljS2V5XCI6XCJCS0NNdHYxbTBuYnNlRzkrRThnN3ljekd1TDArQzdkZzQvc1hPdnI1S21RR25uODlSRU9aMkx5M0tKYVZnYlNaaHNRU2RQZXpuQkY4UzBFMURoSXZmczRcXHUwMDNkXCIsXCJ0YWdcIjpcIlJscWRRVldYTnc3czF6TG4xRHNtUUZSQ1pidzJUbnI1Vm9jcm5ncm1tSHNcXHUwMDNkXCJ9In0=";
											
		
		paymentInformation.fluidData = paymentInformationFluidData;
/*
		var paymentInformationTokenizedCard = new cybersourceRestApi.Ptsv2paymentsPaymentInformationTokenizedCard();
		paymentInformationTokenizedCard.number = '4111111111111111';
		paymentInformationTokenizedCard.expirationMonth = '12';
		paymentInformationTokenizedCard.expirationYear = '2020';
		paymentInformationTokenizedCard.cryptogram = 'EHuWW9PiBkWvqE5juRwDzAUFBAk=';
		paymentInformationTokenizedCard.transactionType = '1';
		paymentInformation.tokenizedCard = paymentInformationTokenizedCard;
*/
		requestObj.paymentInformation = paymentInformation;
//
		var orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
		var orderInformationAmountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
		orderInformationAmountDetails.totalAmount = '20';
		orderInformationAmountDetails.currency = process.env.TXN_CURRENCY;
		orderInformation.amountDetails = orderInformationAmountDetails;

		var orderInformationBillTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
		orderInformationBillTo.firstName = 'Paul';
		orderInformationBillTo.lastName = 'Maesor';
		orderInformationBillTo.address1 = 'A136, 16/F, Gateway 5';
		orderInformationBillTo.locality = 'Harbour City';
		orderInformationBillTo.administrativeArea = 'KT';
		orderInformationBillTo.postalCode = '000000';
		orderInformationBillTo.country = 'HK';
		orderInformationBillTo.email = 'paul.maesor@fiserv.com';
		orderInformationBillTo.phoneNumber = '64327113';
		orderInformation.billTo = orderInformationBillTo;






		requestObj.orderInformation = orderInformation;

		console.log('\n requestObj : \n' + JSON.stringify(requestObj, null, 2));


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
	digital_payment_googlepay(function () {
		console.log('\nCreatePayment end.');
	});
}
module.exports.digital_payment_googlepay = digital_payment_googlepay;