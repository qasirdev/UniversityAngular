(function () {
    'use strict';

    angular
        .module('UniversityApp')
        .service('LoadSettings', LoadSettings);

    LoadSettings.$inject = [];
    function LoadSettings() {

        this.tooltip;
        this.setTooltip = setTooltip;
        this.getTooltip = getTooltip;

        ////////////////

        function setTooltip(tiptool) {
            this.tooltip = tiptool;
        }
        function getTooltip() {
            return this.tooltip;
        }
    }
})();