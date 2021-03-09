var ExbuilderLandingPage = {

        config: {}, // holds the config-exbuilder.json
        selectedExperiment: "", // holds the experiment the user selects
        queryString: "",

        init: function(config_file = "config-exbuilder.json"){

            //initalize settings and fetch the config file
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

            // create the experiment selector
            this.makeExperimentSelector();
        },

        makeExperimentSelector: function(){

            // create experiment selector, pulling options from the experiments object 
            let options = this.config.experiments.map(function(experiment){ return experiment.name;})
            this.makeSelectElement('exbuilder-experiment', options, "pick one");

            // bind UI actions so we can collect which experiment they select client-side
            this.bindUIActions();
       },

        bindUIActions: function(){

            // when the user changes the experiment selection, make the form
            document.querySelector('#exbuilder-experiment').addEventListener('change', function(){
                this.selectedExperiment = this.value;
                ExbuilderLandingPage.makeExperimentForm();
            });
        },

        makeExperimentForm: function(){

            // add the experiments' conditions 
            this.makeSelectElement("id", ['condition 1', 'condition 2'], "pick one");

            // add the rest of the url parameters 
            this.config.new_url_params.forEach(
                (parameter, index) => {
                    switch (parameter.kind){
                        case "select":
                            this.makeSelectElement(parameter.name, parameter.options, parameter.placeholder_text);
                            break;
                        case "input":
                            this.makeInputElement();
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
            select.setAttribute('id', name)  
            div.appendChild(select);

            // add the placeholder text to the begining of the options if it exists
            options = (placeholder_text) ? [placeholder_text].concat(options) : options;

            // for array of options, add them to the select element
            options.forEach(
                (option) => {
                    let opt = document.createElement("option");
                    opt.value = option;
                    opt.text = option;
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

            let btn = document.createElement('button');
            btn.setAttribute('type', "button");
            btn.setAttribute('class', "btn btn-primary");
            btn.innerHTML = "Run experiment";
            // btn.setAttribute('id', );
            div.appendChild(btn);


        },

        createQueryString: function(){

            let form = document.forms[0];
            let formData = new FormData(form);

            let search = new URLSearchParams(formData);
            this.queryString = search.toString();

        }
    }

        

        
