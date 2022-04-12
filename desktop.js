'use strict';

const { desktopCapturer } = require('electron');

class Desktop {
    init() {
        this.startCapturer();
    }

    startCapturer() {
        let video = document.createElement('video');
        video.setAttribute('autoplay', true);
        video.setAttribute('muted', true);
        video.setAttribute('playsinline', true);
        video.style.width = '100%';
        video.style.height = '100%';
        document.body.appendChild(video);

        desktopCapturer.getSources({ types: ['window', 'screen'] }, async (error, sources) => {
            if (error) throw error;
            for (const source of sources) {
                if (source.name.toLocaleLowerCase() === 'entire screen' || source.name.toLocaleLowerCase() === 'screen 1') {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id,
                                minWidth: 1280,
                                maxWidth: 1280,
                                minHeight: 720,
                                maxHeight: 720
                            }
                        }
                    });

                    if (stream) {
                        video.srcObject = stream;
                    }
                }                    
            }
        });
    }
}

module.exports = new Desktop();