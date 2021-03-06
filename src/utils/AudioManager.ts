class AudioManagerImpl {
    public errorAudio = new Audio(process.env.PUBLIC_URL + '/sound/error.wav');
    public playerMessage = new Audio(process.env.PUBLIC_URL + '/sound/message.wav?v=2');
    public guideMessage = new Audio(process.env.PUBLIC_URL + '/sound/message2.wav');
    public guideWin = new Audio(process.env.PUBLIC_URL + '/sound/win.wav');
    public ok = new Audio(process.env.PUBLIC_URL + '/sound/ok.wav');
    public chatOn = new Audio(process.env.PUBLIC_URL + '/sound/chat-on.wav');
    

    public play(audio: HTMLAudioElement) {
        audio.autoplay = true;
        audio.crossOrigin = 'anonymous';
        
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
            .then(_ => {
            })
            .catch(error => {
                console.log(`playback prevented: ${error}`);
            });
        }
    }
}

export const AudioManager = new AudioManagerImpl();