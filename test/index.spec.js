window._DEV_ = true;
var chai = require('chai');
chai.should();

var sdk = require('../dist/fipman.sdk.min.js');


describe('FIPMAN Javascript SDK', () => {

    describe('Validate options', () => {
        it('should throw error if options is missing', () => {
            (() => {
                sdk.validateOptions()
            }).should.throw(Error, "Fipman needs initials options to run!");
        });

        it('should throw error if options ==> apiKey is missing', () => {
            (() => {
                sdk.validateOptions({})
            }).should.throw(Error, "Fipman needs api key!");
        });

        it('should throw error if options ==> storage is missing', () => {
            (() => {
                sdk.validateOptions({ apiKey: 'fake-key' })
            }).should.throw(Error, "Fipman needs storage location!");
        });

        it('should throw error if options ==> storage is not valid', () => {
            (() => {
                sdk.validateOptions({ apiKey: 'fake-key', storage: 'fake-storage' })
            }).should.throw(Error, "Fipman needs valid storage!");
        });

        it('should return true if options are valid', () => {
            sdk.validateOptions({ apiKey: 'fake-key', storage: 'S3' }).should.be.true;
        });

    });

    describe('Set iframe', () => {
        it('should set iframe html', () => {
            sdk.uploaderURL = "http://fake-url/";
            const iframeContainer = sdk.setIframe();
            iframeContainer.should.equal("<div><div id='fipman-inner-container' class='fipman-container'><iframe name='filepicker_dialog' id='filepicker_dialog' border='0' frameborder='0' marginwidth='0' marginheight='0' src='http://client.fipman.com/?options=' style='width: 100%; height: 100%; border: none; position: relative;'></iframe>'</div>");
        })
    });

    describe('Init sdk', () => {
        it('should set valid iframe url', () => {
            const url = sdk.init({
                apiKey: 'fake-key',
                storage: 'S3'
            });

            url.should.equal('http://client.fipman.com/?options={"apiKey":"fake-key","blob":"S3","lang":"en","allowMultipleUpload":true,"allowFiles":"*","maxFileSize":0}')
        });
    });

    describe('Show fipman', () => {
        it('should add styles and container to dom', () => {
            sdk.init({
                apiKey: 'fake-key',
                storage: 'S3'
            });
            sdk.show();
            var stylesDom = document.getElementById('fipman-styles');
            var containerDom = document.getElementById('fipman-container');

            stylesDom.should.not.null;
            stylesDom.innerHTML.should.equal(sdk.style);

            containerDom.should.not.null;
        });
        afterEach(() => sdk.hide());
    });

    describe('Hide fipman', () => {
        it('should remove style and container from dom', () => {
            sdk.uploaderURL = "http://fake-url/?options="
            sdk.init({
                apiKey: 'fake-key',
                storage: 'S3'
            });
            
            sdk.show();
            
            var stylesDom = document.getElementById('fipman-styles');
            stylesDom.should.not.null;

            sdk.hide();
            stylesDom = document.getElementById('fipman-styles');
            (stylesDom === null).should.be.true;
        })
    });
});