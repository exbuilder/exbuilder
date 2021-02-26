var s,
    Exbuilder = {
        settings: {
            config: {}, // holds the config-exbuilder.json
            run: {} // holds the url params for the run to send to database
        },

        init: function(which_do = "experiment"){
            //initalize exbuilder and fetch the config file
            s = this.settings;
            this.getConfig(which_do);

        },

        getConfig: function(which_do){
            // fetch the configuration from config-exbuilder.json
            fetch('../exbuilder/config-exbuilder.json')
            .then(response => response.json())
            .then(data => {
                s.config = data; 
                // depending on what we are doing, take a next action
                switch (which_do) {
                    case "experiment":
                        // get URL variables if initailized on an experiment 
                        this.getURLVars(s.config.url_params)
                        break;
                    case "landingpage":
                        // bind UI actions if initalized on the landing page
                        this.bindUIActions();
                        break;
                }
            }) 
        },

        getURLVars: function(url_params){
            // get the url variables and assign them to s.run
            const params = new URLSearchParams(window.location.search)
            for (const param of s.config.url_params){
                s.run[param] = params.get(param)
            };

            // then generate a random ID for this run 
            this.generateRandomID(s.config.randomid.length);
        },

        bindUIActions: function(){
            console.log("bind ui actions")
        },

        generateRandomID: function(length){
            // generate a random id of length specified in config file
            s.run['randomid'] = '_' + Math.random().toString(36).substr(2, length)
            console.log(s.run.randomid);
        },

        insertRun: function(data = s.run){
 
            // inserts the run to the database (new db row)
            fetch('../exbuilder/php/insert_run.php', {
                method: 'post',
                body: JSON.stringify(data),
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
                        randomid: s.run.randomid
                    })
            })
            .then(result => {console.log('Success:', result);})
            .catch(error => {console.error('Error:', error);});

        },

        getConditionsToRun: function(){

        }
    }

var ExbuilderURLGenerator = {
    

}
