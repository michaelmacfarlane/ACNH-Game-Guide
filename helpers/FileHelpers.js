import * as FileSystem from 'expo-file-system';


const BASE_API_URL = 'http://critternarium.herokuapp.com/api/v1/';


export function loadJsonFile(fileUri) {
    return new Promise((resolve, reject) => {
        FileSystem.readAsStringAsync(fileUri).then(jsonString => {
            console.log('Read guidebook file');
            let jsonData = {};
            try {
                jsonData = JSON.parse(jsonString);
                resolve(jsonData);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        }).catch((e) => {
            console.log(e);
            reject(e);
        });
    });
}

export function saveJsonFile(fileUri, jsonData) {
    return new Promise((resolve, reject) => {
        const jsonString = JSON.stringify(jsonData);
        FileSystem.writeAsStringAsync(fileUri, jsonString).then(jsonString => {
            console.log('Saved guidebook file');
            resolve(true);
        }).catch((e) => {
            console.log(e);
            resolve(false);
        });
    });
}


export async function pathExists(targetPath) {
    return new Promise((resolve, reject) => {
        FileSystem.getInfoAsync(targetPath).then(fileInfo => {
            resolve(fileInfo.exists);
        }).catch(error => {
            console.log(error);
            resolve(false);
        });
    });
}


export function getJson(dataType) {
    return new Promise((resolve, reject) => {

        const dataUrl = `${BASE_API_URL}${dataType}/`;
        console.log('dataUrl', dataUrl);
        fetch(dataUrl)
            .then(response => response.json())
            .then(responseJson => {
                resolve(responseJson);
            }).catch(error => {
                reject(error);
        });
    });
}


export async function getJsonFileContents(useCached, dataType) {
    return new Promise((resolve, reject) => {

        // JSON file path
        const jsonFilePath = FileSystem.documentDirectory + dataType + '.json';
        console.log('jsonFilePath', jsonFilePath);
        pathExists(jsonFilePath).then(exists => {

            // If we are not using cached or the file does not exist
            if (!useCached || !exists) {
                // Download JSON file
                getJson(dataType).then(jsonFileContents => {
                    saveJsonFile(jsonFilePath, jsonFileContents).finally(success => {
                        resolve(jsonFileContents);
                    });

                }).catch(error => {
                    console.log('Error reading:', error);
                    resolve({});
                });
            }

            loadJsonFile(jsonFilePath).then(jsonFileContents => {
                resolve(jsonFileContents);
            }).catch(error => {
                console.log('Error reading:', error);
                resolve({});
            });

            // TODO test what happens when we are offline
        });
    });
}
