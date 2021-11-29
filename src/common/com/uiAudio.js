import beepclear from '../audio/beepclear.wav';
import buttonclick from '../audio/buttonclick.wav';
import buttonclickrelease from '../audio/buttonclickrelease.wav';
import buttonrollover from '../audio/buttonrollover.wav';
import csgo_ui_contract_type1 from '../audio/csgo_ui_contract_type1.wav';

//音频控制器 
var _uiAudio = function () {
    var self = this;

    this.audios = {};

    if (typeof webkitAudioContext === 'undefined') {
        this.auContext = new AudioContext();
    } else {
        this.auContext = new webkitAudioContext();
    }

    this.sMap = {
        "beepclear": beepclear,
        "buttonclick": buttonclick,
        "buttonclickrelease": buttonclickrelease,
        "buttonrollover": buttonrollover,
        "csgo_ui_contract_type1": csgo_ui_contract_type1,
    }


    this.play = function (_fileName) {
        var buffer = null;
        if (typeof this.audios[_fileName] === "undefined") {
            var request = new XMLHttpRequest();
            request.open('GET', self.sMap[_fileName], true);
            request.responseType = 'arraybuffer';
            request.onload = function () {
                self.auContext.decodeAudioData(request.response, function (_buffer) {
                    buffer = _buffer;
                    self.audios[_fileName] = _buffer;
                    var source = self.auContext.createBufferSource();
                    source.buffer = buffer;
                    source.loop = false;
                    source.connect(self.auContext.destination);
                    source.start(0);
                }, function (_e) {
                    debugger;
                });
            }
            request.send();
        } else {
            buffer = self.audios[_fileName];
            var source = this.auContext.createBufferSource();
            source.buffer = buffer;
            source.connect(self.auContext.destination);
            source.start(0);
        }
    }

    this.playBtnOver = function () {
        this.play('buttonrollover');
    }

    this.playBtnClick = function () {
        this.play('buttonclick');
    }

    this.playbeepclear = function () {
        this.play('beepclear');
    }

    this.playbuttonclickrelease = function () {
        this.play('buttonclickrelease');
    }

    this.playcsgo_ui_contract_type1 = function () {
        this.play('csgo_ui_contract_type1');
    }
}

export default _uiAudio;