/*=== Javascript function indexing hear===========

1.counterUp ----------(Its use for counting number)
2.stickyHeader -------(header class sticky)
3.wowActive ----------( Waw js plugins activation)
4.swiperJs -----------(All swiper in this website hear)
5.salActive ----------(Sal animation for card and all text)
6.textChanger --------(Text flip for banner section)
7.timeLine -----------(History Time line)
8.datePicker ---------(On click date calender)
9.timePicker ---------(On click time picker)
10.timeLineStory -----(History page time line)
11.vedioActivation----(Vedio activation)
12.searchOption ------(search open)
13.cartBarshow -------(Cart sode bar)
14.sideMenu ----------(Open side menu for desktop)
15.Back to top -------(back to top)
16.filterPrice -------(Price filtering)

==================================================*/

(function ($) {
    'use strict';
    var rtsJs = {
        m: function (e) {
            rtsJs.d();
            rtsJs.methods();
        },
        d: function (e) {
            this._window = $(window),
            this._document = $(document),
            this._body = $('body'),
            this._html = $('html')
        },
        methods: function (e) {
            rtsJs.wowActive();
            rtsJs.counterUp();
            rtsJs.stickyHeader();
            rtsJs.backToTopInit();
            rtsJs.pricingToggle();
            rtsJs.searchOption();
            rtsJs.sideMenu();
            rtsJs.smoothScroll();
            rtsJs.preloader();
            rtsJs.videoModalReset();

        },
        
        wowActive: function () {
          new WOW().init();
        },
        counterUp: function (e) {
            $('.counter').counterUp({
              delay: 10,
              time: 1000
            });
            $('.counter').addClass('animated');
            $('h3').addClass('animated fadeIn');
        },
        stickyHeader: function (e) {
            $(window).scroll(function () {
              if ($(this).scrollTop() > 0) {
                  $('.header--sticky').addClass('sticky')
              } else {
                  $('.header--sticky').removeClass('sticky')
              }
            })
        },
        videoModalReset: function () {
            document.addEventListener('hidden.bs.modal', function (event) {
                if (event && event.target && event.target.id === 'videoModal') {
                    var iframe = document.getElementById('demoVideo');
                    if (iframe) {
                        var src = iframe.getAttribute('src');
                        iframe.setAttribute('src', src);
                    }
                }
            });
        },
        backToTopInit: function () {
            $(document).ready(function(){
            "use strict";
        
            var progressPath = document.querySelector('.progress-wrap path');
            var pathLength = progressPath.getTotalLength();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
            progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';		
            var updateProgress = function () {
              var scroll = $(window).scrollTop();
              var height = $(document).height() - $(window).height();
              var progress = pathLength - (scroll * pathLength / height);
              progressPath.style.strokeDashoffset = progress;
            }
            updateProgress();
            $(window).scroll(updateProgress);	
            var offset = 50;
            var duration = 550;
            jQuery(window).on('scroll', function() {
              if (jQuery(this).scrollTop() > offset) {
                jQuery('.progress-wrap').addClass('active-progress');
              } else {
                jQuery('.progress-wrap').removeClass('active-progress');
              }
            });				
            jQuery('.progress-wrap').on('click', function(event) {
              event.preventDefault();
              jQuery('html, body').animate({scrollTop: 0}, duration);
              return false;
            })
            
            
          });
    
        },

        pricingToggle: function () {
            $(document).ready(function () {
              $(".pricing__toogle").change(function () {
                if ($(this).is(":checked")) {
                  $(".monthly__pricing").removeClass("active");
                  $(".yearly__pricing").addClass("active");
                } else {
                  $(".monthly__pricing").addClass("active");
                  $(".yearly__pricing").removeClass("active");
                }
              });
            });
        },

        searchOption: function () {
            $(document).on('click', '#search', function () {
                $(".search-input-area").addClass("show");
                $("#anywhere-home").addClass("bgshow");
            });
            $(document).on('click', '#close', function () {
                $(".search-input-area").removeClass("show");
                $("#anywhere-home").removeClass("bgshow");
            });
            $(document).on('click', '#anywhere-home', function () {
                $(".search-input-area").removeClass("show");
                $("#anywhere-home").removeClass("bgshow");
            });
        },
        sideMenu:function(){
          // metismenu active
          $('#mobile-menu-active').metisMenu();

          // collups menu side right
          $(document).on('click', '#menu-btn', function () {
            $("#side-bar").addClass("show");
            $("#anywhere-home").addClass("bgshow");
          });
          $(document).on('click', '.close-icon-menu', function () {
            $("#side-bar").removeClass("show");
            $("#anywhere-home").removeClass("bgshow");
          });
          $(document).on('click', '#anywhere-home', function () {
            $("#side-bar").removeClass("show");
            $("#anywhere-home").removeClass("bgshow");
          });
          $(document).on('click', '.onepage .mainmenu li a', function () {
            $("#side-bar").removeClass("show");
            $("#anywhere-home").removeClass("bgshow");
          });
        },

        smoothScroll: function (e) {
          $(document).on('click', '.onepage a[href^="#"]', function (event) {
            event.preventDefault();
        
            $('html, body').animate({
                scrollTop: $($.attr(this, 'href')).offset().top
            }, 2000);
          });
        },
        preloader:function(){
          window.addEventListener('load',function(){
            document.querySelector('body').classList.add("loaded")  
          });          
        },

    }

    rtsJs.m();
  })(jQuery, window) 







