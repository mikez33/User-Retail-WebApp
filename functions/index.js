const functions = require('firebase-functions')
const { Storage } = require('@google-cloud/storage');
const projectId = 'user-retail-webapp';
const keyFileName = 'user-retail-webapp-firebase-adminsdk-cwz27-ead3d3e589.json';
let gcs = new Storage ({
	projectId, keyFileName
});
const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const cors = require('cors')({origins: true});
const Busboy = require('busboy');
const fs = require("fs");

// exports.uploadFile = functions.https.onRequest((req, res) => {
//   cors(req, res, () => {
//     if (req.method !== "POST") {
//       return res.status(500).json({
//         message: "Not allowed"
//       });
//     }
//     const busboy = new Busboy({ headers: req.headers });
//     let uploadData = null;

//     busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
//       const filepath = path.join(os.tmpdir(), filename);
//       uploadData = { file: filepath, type: mimetype };
//       file.pipe(fs.createWriteStream(filepath));
//     });

//     busboy.on("finish", () => {
//       const bucket = gcs.bucket("user-retail-webapp/storage/user-retail-webapp.appspot.com/files");
//       bucket
//         .upload(uploadData.file, {
//           uploadType: "media",
//           metadata: {
//             metadata: {
//               contentType: uploadData.type
//             }
//           }
//         })
//         .then(() => {
//           res.status(200).json({
//             message: "It worked!"
//           });
//         })
//         .catch(err => {
//           res.status(500).json({
//             error: err
//           });
//         });
//     });
//     busboy.end(req.rawBody);
//   });
// });



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