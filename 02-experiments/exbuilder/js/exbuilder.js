var s,
    Exbuilder = {
        settings: {
            config: {}, // holds the config-exbuilder.json
            run: {"experiment": 1, "condition": 2} // holds the experiment the user selects
        },

        init: function(config_file = "config-exbuilder.json"){

            //initalize settings and fetch the config file
            s = this.settings;
            this.getConfig(config_file);
        },

        getConfig: function(config_file){

            // fetch the config file 
            fetch('../exbuilder/'+config_file)
            .then(response => response.json())
            .then(data => {
                s.config = data; 
                this.getURLVars(s.config.new_url_params);
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

        postMedia: function(){

            // fetch the config file 
            fetch('../exbuilder/php/post_media.php')
            .then(result => {console.log('Success:', result);})
            .catch(error => {console.error('Error:', error);});
        },

        getConditionsToRun: function(){

        }
    }

var ExbuilderLandingPage = {
    

}
