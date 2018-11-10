
class Util {

    static isNullOrUndefined(obj) {
        return obj === null || typeof obj === "undefined";
    }

    
    /**
     * @param {String} url 
     * @returns {Object} The fetched data, as a JSON object
     * @throws {Error} If an error occurs
     */
    static GetJSONResource(url) {
        return new Promise((resolve, reject) => {
            $.get(url, (data) => {
                try {
                    let json = JSON.parse(data);
                    resolve(json);
                } catch(err) {
                    reject(err);
                }
            });
        });
    }
}

export {Util};