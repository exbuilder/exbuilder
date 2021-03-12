var Exbuilder = {
  
    config: {}, // holds the config-exbuilder.json
    experiment: {}, // holds the selected experiments details from the config file
    run: {},// holds the url variables 

    init: function(config_file = "config-exbuilder.json"){

        //fetch the config file
        this.getConfig(config_file);
    },

    getConfig: function(config_file){

        // fetch the config file 
        fetch('../exbuilder/'+config_file)
        .then(response => response.json())
        .then(data => {
            this.config = data;
            this.parseURLVars();
        }) 
    },

    parseURLVars: function(){
        // get the url variables and assign them to this.run and pull the current experiment from config
        const params = new URLSearchParams(window.location.search)
        this.run = Object.fromEntries(params);
        this.experiment = this.config.experiments[this.run.experiment];

        // if the condition is random, then select a random condition 
        if (this.run.condition == "random") { this.selectRandomCondition() }

        // then generate a random ID for this run 
        this.generateRandomID(this.config.randomid.length);

    },

    generateRandomID: function(length){
        // generate a random id of length specified in config file
        this.run['randomid'] = '_' + Math.random().toString(36).substr(2, length)
        console.log(this.run.randomid);
    },

    selectRandomCondition: function(){

        // create some search params for the get request
        let params = new URLSearchParams({experiment: this.run.experiment})

        // pass the search params to count_runs.php to count runs
        fetch('../exbuilder/php/count_runs.php?'+params, {
            method: 'get',
        })
        .then(response => response.json())
        .then(data => { console.log(data);
            
            // get an array of conditions for this experiment
            let conditions = Object.keys(this.experiment.conditions)

            // while the condition is still random
            while (this.run.condition === "random"){

                // randomly select a condition
                let random_condition = conditions[Math.floor(Math.random() * conditions.length)];

                // get the number already run for this condition and the number the user wants to run
                let already_run = data.find(condition => condition.condition === random_condition);
                let to_run = this.experiment.conditions[random_condition].n + this.experiment.conditions[random_condition].exclusions;

                // if they haven't reached their to_run value yet, use the random conditon; otherwise try again in the while loop
                this.run.condition = (already_run.count <= to_run || already_run != true) ? random_condition : "random"; 

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
