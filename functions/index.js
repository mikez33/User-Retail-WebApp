const functions = require('firebase-functions')
const { Storage } = require('@google-cloud/storage');
const projectId = 'https://console.firebase.google.com/project/user-retail-webapp/storage/user-retail-webapp.appspot.com/files';
let gcs = new Storage ({
	projectId
});
const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;



exports.onFileChange = functions.storage.object().onFinalize(event => {
	console.log(event);
	const bucket = event.bucket;
	const contentType = event.contentType;
	const filePath = event.name;
	console.log('file detected')

	if(path.basename(filePath).startsWith('resized-')){
		console.log('already resized this file')
		return;
	}

	const destBucket = gcs.bucket(bucket);
	const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
	const metadata = { contentType : contentType }
	return destBucket.file(filePath).download({
		destination : tmpFilePath
	}).then(() => {
        return spawn('convert', [tmpFilePath, '-resize', '500x500', tmpFilePath]);
    }).then(() => {
		return destBucket.upload(tmpFilePath, {
			destination:'resized-'+ path.basename(filePath),
			metadata: metadata
		}) 


	})

});