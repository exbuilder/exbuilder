var ExbuilderAudioRecorder = {

    recording: {
        chunks: [],
        blob: [],
        filename: ""
    },
    warning: { // text for warning messages
        browser: "Sorry, your browser does not support media recording, so this experiment will not work.",
        permission: "You must grant the experiment access to your microphone to take part."
    },

    init: function(){

        navigator.mediaDevices.getUserMedia( {audio: true, video: false})
        .then(stream => {this.handleAvailableData(stream)})
        .catch(error => {this.showError(this.warning.permission)});

    },

    handleAvailableData: function(stream){

        this.recorder = new MediaRecorder(stream);
        this.recorder.ondataavailable = event => { 
            this.recording.chunks.push(event.data);
        };
        this.recorder.onstop = event => {
            this.recording.blob = new Blob(this.recording.chunks, {type: 'audio/webm'});
            this.saveAudio(this.recording.blob, this.recording.filename);
        }
    },

    showError: function(message){
        // create a p and add the message; append to body
        let p = document.createElement("p");
        p.innerHTML = message;
        document.body.appendChild(p);
    },

    startRecording: function(){

        try{
            this.recorder.start();
        } catch {
            console.log("the media recorder failed to start");
        };

    },

    stopRecording: function(filename){

        this.recording.filename = filename;

        try{
            this.recorder.stop();
        } catch {
            console.log("the media recorder failed to stop");
        };

    },

    saveAudio: function(blob, filename){

        let form_data = new FormData();
        form_data.append("filedata", blob);
        form_data.append("filename", filename);

          
        fetch('../exbuilder/php/post_media.php', {
            method: 'post',
            body: form_data
        })
            .then(result => {console.log('Success:', result);})
            .catch(error => {console.error('Error:', error);});
    }
}



