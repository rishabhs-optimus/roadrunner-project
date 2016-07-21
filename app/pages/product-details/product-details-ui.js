define([
    '$',
    'global/utils',
    'magnifik',
    'translator',
    'hijax',
    'bellows',
    'components/sheet/sheet-ui',
    'dust!components/scroller/scroller',
    'pages/product-details/ui/pdp-reviews',
    'dust!components/loading/loading',
    'scrollTo'

    // 'global/parsers/product-tile-parser'

], function($, Utils, Magnifik, translator, Hijax, bellows, sheet, ScrollerTmpl, pdpReviews, LoadingTemplate) {
    var $addToCartPinny = $('.js-added-to-cart-pinny');
    var $videoBellows = $('.c-video-bellows');
    var $reviewBellow = $('.c-reviews-bellow');
    var displayTabs = function() {
        $('#grp_1,#grp_2,#grp_3,#grp_4').show();
    };
    var reviewSection = function() {
        pdpReviews.addNoRatingsSection();
        pdpReviews.changeHeadingPosition();
        pdpReviews.updatePaginationButtons();
        pdpReviews.createRangeInReview();
        pdpReviews.transformSortBy();
        pdpReviews.createPaginationDropDown();
        pdpReviews.reviewPaginationDropDownChangeFunc();

    };
    var updateReviewsSection = function() {
        pdpReviews.changeHeadingPosition();
        pdpReviews.updatePaginationButtons();
        pdpReviews.transformSortBy();
        pdpReviews.createPaginationDropDown();
        pdpReviews.reviewPaginationDropDownChangeFunc();
    };
    var bindEvents = function() {
        $('body').on('click', '.pr-page-next', function() {
            setTimeout(function() {
                updateReviewsSection();
                $.scrollTo($reviewBellow);
            }, 1000);
        });
        $('body').on('click', '.pr-page-prev', function() {
            setTimeout(function() {
                updateReviewsSection();
                $.scrollTo($reviewBellow);
            }, 1000);
        });
        $('body').on('change', '#pr-sort-reviews', function() {
            var $container = $('.pr-contents-wrapper');
            new LoadingTemplate(true, function(err, html) {
                $container.empty().append($(html));
            });
            setTimeout(function() {
                updateReviewsSection();
                $.scrollTo($reviewBellow);
            }, 500);
        });
        $('.c-review-page-dropdown').on('change', function() {
            var value = $(this).val();
            var $paginationWrapper = $('.pr-pagination-bottom');
            var text = $paginationWrapper.find('.pr-page-nav a').attr('onclick');
            var parts = text.split('getReviewsFromMeta(');
            var secondpart = parts[1].split(/,(.+)?/)[1];
            var newLink = parts[0] + 'getReviewsFromMeta(' + value + ',' + secondpart;
            $('.c-temp-review-pagination-anchor').attr('onclick', newLink);
            $('.c-temp-review-pagination-anchor').click();
            setTimeout(function() {
                updateReviewsSection();
                $.scrollTo($reviewBellow);
            }, 500);
        });
    };

    var youMayAlsoLike = function() {
        var $container = $('.js-suggested-products');
        var $parsedProducts = [];
        var $heading = $('<h2 class="c-title c--small u-margin-bottom-md">').text('You Might Also Like');
        var productTileData = [];
        setTimeout(function() {
            if ($('#PRODPG1_cm_zone').children().length === 0) {
                youMayAlsoLike();
            } else {
                var $items = $('.pdetailsSuggestionsCon');
                var $titles = $items.find('strong').each(function() {
                    var $this = $(this);
                });
                $items.map(function(_, item) {
                    var $item = $(item);
                    var $content = {
                        slideContent :$item
                    };
                    $parsedProducts.push($content);
                });
                var scrollerData = {
                    slideshow: {
                        slides: $parsedProducts
                    }
                };

                new ScrollerTmpl(scrollerData, function(err, html) {
                    $container.empty().html(html);
                });

                $container.prepend($heading);
            }
        }, 500);
        $('#pdetails_suggestions').addClass('u-visually-hidden');
    };


    var interceptAddToCart = function interceptAddToCart() {

        var _override  = window.updateShoppingCartSummary;
        window.updateShoppingCartSummary = function() {
            var override = _override.apply(this, arguments);
            var $modal = $('#addToCartInfo');
            var $content = $('#addToCartInfoCont');
            $content.find('#continueShoppingLink').insertAfter('#viewCartLink');
            //   $content.find('#monetate_selectorBanner_b9e875a3_00').remove();
            $modal.addClass('u-visually-hidden');
            $addToCartPinny.find('.c-sheet__title').html('Added to Cart');
            $addToCartPinny.find('.js-added-to-cart-pinny__body').html($content);
            $addToCartPinny.find('.pinny__close').addClass('container-close');
            if (!$('.js-added-to-cart-pinny').hasClass('js-rendered')) {
                $addToCartPinny.pinny('open');
            }
            $('.js-added-to-cart-pinny').addClass('js-rendered');

            return _override;
        };

    };

    var updateCartMessage = function updateCartMessage() {
        var hijax = new Hijax();
        // Intercept AJAX requests
        hijax.set(
            'UpdateCartMessageHijaxProxy',
            function(url) {
                return /quickInfoAjaxAddToCart/.test(url);
            },
            {
                complete: function(data, xhr) {
                    interceptAddToCart();
                    if ($('#addToCartInfoCont').find('#addToCartInfoTitle').html() === null ) {
                        $('#addToCartInfoTitle').insertAfter($('#addToCartVIPMsg'));
                    }
                    $('#addToCartInfoTitle').append($('<span class="addToCartTitle"></span>'));
                }
            }
        );
    };

    $('body').on('click', '#videoLinkButton', function() {
        // Scroll to Reviews Bellows
        $.scrollTo($videoBellows);
        // Open Bellows for Reviews and Rating
        // This is required as SVG icon was not changing on call of Bellows open method
        if (!$videoBellows.hasClass('bellows--is-open')) {
            $videoBellows.find('.bellows__header').click();
        }
    });

    $('body').on('click', '.c-overallRating', function() {
        var $reviewsBellows = $('.c-reviews-bellow');
        // Scroll to Reviews Bellows
        $.scrollTo($reviewsBellows);
        // Open Bellows for Reviews and Rating
        // This is required as SVG icon was not changing on call of Bellows open method
        if (!$reviewsBellows.hasClass('bellows--is-open')) {
            $reviewsBellows.find('.bellows__header').click();
        }
    });

    var scrollToTop = function() {
        $('.js-back-to-top').on('click', function() {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });
    };
    var videoBellowState = function() {
        var $bellow = $('.js-product-bellows').find('.bellows__item.c-video-bellows');
        var $icon = $bellow.find('.c-bellows__header .c-icon');
        $icon.attr('data-fallback', 'img/png/minus.png');
        $icon.find('title').text('minus');
        $icon.find('use').attr('xlink:href', '#icon-minus');
        $bellow.addClass('bellows--is-open');
    };

    var insertScroller =  function() {
        var $container = $('.s7flyoutSwatches');
        setTimeout(function() {
            if ($container.length == 0) {
                insertScroller();
            } else {
                var $parsedProducts = [];
                var $items = $('.s7flyoutSwatch');
                var $images = $items.find('img').each(function() {
                    var $this = $(this);
                });
                $items.map(function(_, item) {
                    var $item = $(item);
                    var $content = {
                        slideContent :$item
                    };
                    $parsedProducts.push($content);
                });
                var scrollerData = {
                    slideshow: {
                        slides: $parsedProducts
                    }
                };

                new ScrollerTmpl(scrollerData, function(err, html) {
                    $container.empty().html(html);
                });
            }
        }, 500);
    };

    var productDetailsUI = function() {
        displayTabs();
        reviewSection();
        youMayAlsoLike();
        bindEvents();
        updateCartMessage();
        scrollToTop();
        interceptAddToCart();
        videoBellowState();
        //insertScroller();
        $('body').on('click', '#continueShoppingLink', function() {
            var $closeButton = $addToCartPinny.find('.pinny__close');
            $closeButton.click();
        });
        sheet.init($addToCartPinny, {
            zIndex: 2000,
            shade: {
                zIndex: 1999,
                cssClass: 'js-wishlist-shade'
            },
            closed: function() {
                $('#addToCartInfo_mask').css('display', 'none');
                $('.js-added-to-cart-pinny').removeClass('js-rendered');
            }
        });
    };

    return productDetailsUI;
});
