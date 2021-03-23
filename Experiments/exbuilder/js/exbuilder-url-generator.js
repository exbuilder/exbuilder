var ExbuilderURLGenerator = {

    config: {}, // holds the config-exbuilder.json
    experiment: "", // holds the experiment the user selects
    form: "",

    init: function(config_file = "config-exbuilder.json"){

        //fetch the config file to kick things off 
        this.getConfig(config_file);
    },

    getConfig: function(config_file){

        // fetch the config file without cache so the user can see updates when developing
        fetch('../exbuilder/'+config_file, {
            method: "get",
            headers: {
                'pragma': 'no-cache',
                'cache-control': 'no-cache'
            }
        })
        .then(response => response.json())
        .then(data => {
            this.config = data; 
            this.makeLandingPage();
        }) 
    },

    makeLandingPage: function(){

        // set the title and description with config file
        document.getElementById('exbuilder-title').innerHTML = this.config.landing_page.title;
        document.getElementById('exbuilder-description').innerHTML = this.config.landing_page.description;
        document.getElementById('exbuilder-project').value = this.config.project.name;

        // create the experiment selector
        this.makeExperimentSelector();
    },

    makeExperimentSelector: function(){

        // create experiment selector, pulling options from the experiments object 
        let options = Object.keys(this.config.experiments);
        this.makeSelectElement('experiment', options, this.config.landing_page.placeholder_text);

        // bind UI actions so we can collect which experiment they select client-side
        this.bindUIActions();
   },

    bindUIActions: function(){

        // when the user changes the experiment selection, make the form
        document.querySelector('#experiment').addEventListener('change', function(){
            ExbuilderURLGenerator.makeExperimentForm(this.value);
        });
    },

    makeExperimentForm: function(experiment){

        // get the experiment the user picked
        this.experiment = this.config.experiments[experiment];

        // get the form and add an action to send people to the right experiment
        this.form = document.getElementById('exbuilder-form');
        this.form.setAttribute('action', "/"+this.experiment.path);

        // add the conditions for this experiment (and add a random option)
        let conditions = Object.keys(this.experiment.conditions);
        conditions.push("random");
        
        // make the selector for the conditions
        this.makeSelectElement("condition", conditions, "Select a condition");

        // add the rest of the url parameters 
        this.config.url_params.forEach(
            (parameter, index) => {
                switch (parameter.kind){
                    case "select":
                        // let this_options = (this.experiment.override_options) get the override options
                        this.makeSelectElement(parameter.name, parameter.options, parameter.placeholder_text);
                        break;
                    case "input":
                        this.makeInputElement(parameter.name, parameter.placeholder_text);
                        break;
                }
            }
        );
        
        this.makeButton();
    },

    makeSelectElement: function(name, options, placeholder_text){

        // make a row div so it looks nice on most devices
        let div = this.makeRowDiv();

        // create the select element and add it to the dom
        let select = document.createElement("select");
        select.setAttribute('class', "form-select");
        //select.setAttribute('form', "exbuilder-form");
        select.setAttribute('id', name);
        select.setAttribute('name', name)
        div.appendChild(select);

        // add the placeholder text to the begining of the options if it exists
        options = (placeholder_text) ? [placeholder_text].concat(options) : options;

        // for array of options, add them to the select element
        options.forEach(
            (option) => {
                let opt = document.createElement("option");
                opt.value = option;
                opt.text = option;
                if (option === "random"){
                    opt.disabled = true;
                }
                select.appendChild(opt);
            }
        )          
    },

    makeInputElement: function(name, placeholder_text){

        // make a row div so it looks nice on most devices
        let div = this.makeRowDiv()

        // create the input element and add it to the dom
        let input = document.createElement("input");
        input.setAttribute('type', "text");
        input.setAttribute('name', name);
        input.setAttribute('class', "form-control");
        input.setAttribute('placeholder', placeholder_text);
        div.appendChild(input);    
    },

    makeRowDiv: function(){

        // make a div with a bootstrap row mb-3 class and add to form
        let div = document.createElement('div');
        div.setAttribute('class', "row mb-3");
        div.setAttribute('id', "row-div");
        document.getElementById('exbuilder-form').appendChild(div);

        //return the div so we can append children
        return div;
    },

    makeButton: function(){

        let div = this.makeRowDiv();

        let btn = document.createElement('input');
        btn.setAttribute('type', "submit");
        btn.setAttribute('class', "btn btn-primary");
        btn.innerHTML = "Run experiment";
        // btn.setAttribute('id', );
        div.appendChild(btn);

    }
}
