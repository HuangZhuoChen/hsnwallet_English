let isCalled = false, timer;

var NoDoublePress = {
    onPress(callback, interval = 1000){
        if (!isCalled) {
            // console.log("first onpress");
            isCalled = true;
            clearTimeout(timer);
            timer = setTimeout(() => {
                isCalled = false;
            }, interval);
            return callback();
        }else{
            // console.log("repeat onpress refuse");
            return '';
        }
    },
};
module.exports = NoDoublePress;
