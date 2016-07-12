define([
    '$',
    'global/utils',
    'magnifik',
    'translator',
    'hijax',
    'bellows',
    'components/sheet/sheet-ui',
    'dust!components/scroller/scroller',
    'pages/product-details/ui/pdp-reviews'
    // 'global/parsers/product-tile-parser'

], function($, Utils, Magnifik, translator, Hijax, bellows, sheet, ScrollerTmpl, pdpReviews) {
    //productTileParser
    var displayTabs = function() {
        $('#grp_1,#grp_2,#grp_3,#grp_4').show();
    };
    var reviewSection = function reviewSection() {
        // Pdp Reviews section
        pdpReviews.addNoRatingsSection();
        pdpReviews.setHeadings();
        pdpReviews.updatePaginationButtons();
        pdpReviews.createPaginationDropDown();
        pdpReviews.createRangeInReview();
        pdpReviews.reviewPaginationDropDownChangeFunc();
        pdpReviews.sortByDropDown();
    };

    var youMayAlsoLike = function() {
        var $container = $('.js-suggested-products');
        var $heading = $('<h2 class="c-title c--small u-margin-bottom-md">').text('You Might Also Like');
        var productTileData = [];
        setTimeout(function() {
            if ($('#PRODPG1_cm_zone').children().length === 0) {
                youMayAlsoLike();
            } else {
                var $items = $('.pdetailsSuggestionsCon');

                // ROAD-244: Change titles (<strong>) to <h6>
                var $titles = $items.find('strong').each(function() {
                    var $this = $(this);
                    var $html = $this.html().replace('&nbsp;', ' ');
                    $this.replaceWith('<div class="ellipsis-container clamped clamped-2">' +
                                    '<h6><span class="ellipsis">' + $html +
                                    '</span></h6>' +
                               '</div>');
                });
                var scrollerData = {
                    // slideshow: {
                    //     productTiles: parsedProducts
                    // }
                };

                new ScrollerTmpl(scrollerData, function(err, html) {
                    $container.empty().html(html);
                });

                $container.prepend($heading);
            }
        }, 500);
    };

    var productDetailsUI = function() {
        displayTabs();
        reviewSection();
        //reviewSection();
        youMayAlsoLike();
    };

    return productDetailsUI;
});
