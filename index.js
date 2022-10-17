'use strict';

class ServerlessEphemeralStorage {

	constructor(serverless, options, loggingModule) {
		this.serverless = serverless;
		// set provider 'aws'
		this.provider = this.serverless.getProvider('aws');
		if (loggingModule && loggingModule.log) {
			this.log = loggingModule.log;
		} else if (serverless.cli.log) {
			this.log = {
				info: (message) => {
					serverless.cli.log(message);
				}
			};
		} else {
			this.log = {
				info: (message) => {
					console.log(message);
				}
			};
		}

		// Default configValidationMode is 'warn'
		this.serverless.service.configValidationMode = 'error'

		// Create schema for your properties. 
		if (
			this.serverless.configSchemaHandler &&
			this.serverless.configSchemaHandler.defineFunctionProperties
		) {
			this.serverless.configSchemaHandler.defineFunctionProperties(
				'aws',
				{
					properties: {
						ephemeralStorageSize: { type: 'integer', minimum: 512, maximum: 10240 }
					},
				},
			);
		}
		this.options = options;
		this.hooks = {
			'package:compileFunctions': compileFunctions.bind(this)
		};

		function compileFunctions(plugin = this) {
			plugin.log.info('Setting EphemeralStorage size for all lambda function');
			let functions = plugin.serverless.service.getAllFunctions();
			functions.forEach(funcName => {
				const functionLogicalId = plugin.provider.naming.getLambdaLogicalId(funcName);
				const cfTemplate = plugin.serverless.service.provider.compiledCloudFormationTemplate;
				const functionResource = cfTemplate.Resources[functionLogicalId]
				const functionObject = plugin.serverless.service.getFunction(funcName);
				functionObject.package = functionObject.package || {};
				if (functionObject.ephemeralStorageSize) {
					functionResource.Properties.EphemeralStorage = {
						Size: functionObject.ephemeralStorageSize,
					};
				}
			});
		}
	}
}
module.exports = ServerlessEphemeralStorage;