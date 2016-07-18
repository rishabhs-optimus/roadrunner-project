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
     var $addToCartPinny = $('.js-added-to-cart-pinny');
    var displayTabs = function() {
        $('#grp_1,#grp_2,#grp_3,#grp_4').show();
    };
    var reviewSection = function() {
        pdpReviews.addNoRatingsSection();
        pdpReviews.changeHeadingPosition();
        pdpReviews.updatePaginationButtons();
        pdpReviews.createRangeInReview();

    };
    var bindEvents = function() {
        $('body').on('click', '.pr-page-next', function() {
            setTimeout(function() {
                pdpReviews.addNoRatingsSection();
                pdpReviews.changeHeadingPosition();
                pdpReviews.updatePaginationButtons();
            }, 1000);
        });
        $('body').on('click', '.pr-page-prev', function() {
            setTimeout(function() {
                pdpReviews.addNoRatingsSection();
                pdpReviews.changeHeadingPosition();
                pdpReviews.updatePaginationButtons();
            }, 1000);
        });
        $('body').on('change', '#pr-sort-reviews', function() {
            setTimeout(function() {
                pdpReviews.addNoRatingsSection();
                pdpReviews.changeHeadingPosition();
                pdpReviews.updatePaginationButtons();
            }, 1000);
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

      var _updateShoppingCartSummary = window.updateShoppingCartSummary;
      window.updateShoppingCartSummary = function() {
          var result = _updateShoppingCartSummary.apply(this, arguments);
          var $modal = $('#addToCartInfo');
          var title = $('.addToCartTitle').html();
          var $content = $('#addToCartInfoCont');
          $content.find('#monetate_selectorBanner_b9e875a3_00').remove();
          $modal.addClass('u-visually-hidden');
          $addToCartPinny.find('.c-sheet__title').html(title);
          $addToCartPinny.find('.js-added-to-cart-pinny__body').html($content);
          $addToCartPinny.find('.pinny__close').addClass('container-close');
          $addToCartPinny.pinny('open');

          return result;
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

    var scrollToTop = function() {
        $('.js-back-to-top').on('click', function() {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });
    };

    var productDetailsUI = function() {
        displayTabs();
        reviewSection();
        youMayAlsoLike();
        bindEvents();
        updateCartMessage();
        scrollToTop();
        interceptAddToCart();
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
           }
       });
    };

    return productDetailsUI;
});
