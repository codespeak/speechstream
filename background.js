chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('window.html', {
    'bounds': {
        'width': 400,
        'height': 500
        }
    });
    var connection = new WebSocket("ws://localhost:8888");
    connection.onopen = function () {
        console.log('TRACE')
        var recognition = newReco();
        function newReco() {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onend = function(){
                console.log('end', arguments);
                newReco();
            }
            try {
                recognition.start();
            }
            catch (err) {}

            recognition.onresult = function(event) {
                var resultsLength = event.results.length -1 ;
                console.log(event.results[resultsLength].isFinal);
                var ArrayLength = event.results[resultsLength].length -1;
                var saidWord = event.results[resultsLength][ArrayLength].transcript;
                if (event.results[resultsLength].isFinal) {
                    console.log(saidWord);
                    connection.send(saidWord);
                }
            }
            return recognition;
        }
    };
});