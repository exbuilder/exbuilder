var Exbuilder = {
    config: {},
    run: {},// holds the url variables 

    init: function(config_file = "../exbuilder/config-exbuilder.json") {
        return new Promise((resolve, reject) => {

            this.getConfig(config_file)
            .then( config => { return this.getURLVars(); })
            .then( run => { return this.assignRandomId(); })
            .then( id => { 
                if (this.run) {
                    console.log("Exbuilder initalized succesfully..."); 
                    console.log(this.run);
                    resolve(this.run);
                } else {
                    reject("Exbuilder failed to initialize... ");
                }    
            })
            .catch( err => { reject(err); })
        })
    },

    getConfig: function(config_file) {
        return new Promise((resolve, reject) => {

            fetch(config_file)
                .then(response => { return response.json(); })
                .then(data => { 
                    this.config = data;
                    resolve(data); 
                })
                .catch(err => { reject(err); });
        });

    },

    getURLVars: function() {
        return new Promise((resolve, reject) => {
            // If browser supposrts URL search params, get them and generate the run
            if ('URLSearchParams' in window){
                let params = new URLSearchParams(window.location.search);
                this.run = Object.fromEntries(params);
                resolve(this.run);
            } else {
                reject(" Exbuilder cannot retrieve url params, your browser does not support URLSearchParams... ");
            }
        })
    },

    assignRandomId: function() {
        return new Promise((resolve, reject) => {

            if (this.config.randomid.length) {
                this.run['randomid'] = '_' + Math.random().toString(36).substr(2, this.config.randomid.length);
                resolve(this.run.randomid);
            } else {
                reject("Exbuilder cannot assign random id; length not specified")
            }
        })
    },

    insertRun: function(){

        // inserts the run to the database (new db row)
        fetch('../exbuilder/php/insert_run.php', {
            method: 'post',
            body: JSON.stringify(this.run),
        })
        .then(result => {console.log('Success:', result);})
        .catch(error => {console.error('Error:', error);});
    },

    updateRun: function(data){

        // updates the run in the database (updates the randomid's data column)
        fetch('../exbuilder/php/update_run.php', {
            method: 'post',
            body: JSON.stringify( {
                    json_data: data,
                    randomid: this.run.randomid
                })
        })
        .then(result => {console.log('Success:', result);})
        .catch(error => {console.error('Error:', error);});
    }
}
