var s,
    Exbuilder = {
        settings: {
            run: { // the url variables that exbuilder expects to recieve
                participant: '', 
                experiment: '',
                condition: '',
                researcher: '',
                sourcedb: '',
                location: ''
            },
            // in addition to the url variables, exbuilder will also generate a randomid number for each run
            randomid_characters: 12, //how long do you want this randomid to be?
            warnings: {
                missing_urlvars: true, // do you want to be warned if your URL is missing some variables? 
                extra_urlvars: true // do you want to be warned if you URL has extra variables?
            }
        },

        init: function(){
            //kick things off by initalizing the settings and generating the randomid
            s = this.settings
            this.getURLVars();
        },

        getURLVars: function(){
            // get the url variables and assign them to our s.run object
            const params = new URLSearchParams(window.location.search)
            const keys = Object.keys(s.run)

            for (key of keys){
                s.run[key] = params.get(key)
            }
            console.log(s.run)

            this.generateRandomID(s.randomid_characters);
        },

        generateRandomID: function(characters){
            // generate a random id of some length 
            // we don't check the database to see if this is unique, but we could
            s.run['randomid'] = '_' + Math.random().toString(36).substr(2, characters)
            console.log(s.run.randomid);

        },

        insertRun: function(data = s.run){
 
            fetch('../exbuilder/php/insert_run.php', {
                method: 'post',
                body: JSON.stringify(data),
            })
            .then(result => {console.log('Success:', result);})
            .catch(error => {console.error('Error:', error);});
        },

        updateRun: function(data){
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
    
Exbuilder.init();