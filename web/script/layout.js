$(function () {
    easyloader.base = './script/jeasyui/';
    easyloader.theme = "bootstrap";
    function load1() {

        easyloader.load(['messager', "tabs"], function () {
            $.messager.alert('Title', 'load ok');
        });
    }
    load1()
});