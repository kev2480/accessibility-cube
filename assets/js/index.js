// accordion
$(function() {
  var accordion = $('body').find('[data-behavior="accordion"]');
  var expandedClass = 'is-expanded';

  $.each(accordion, function () { // loop through all accordions on the page

    var accordionItems = $(this).find('[data-binding="expand-accordion-item"]');

    $.each(accordionItems, function () { // loop through all accordion items of each accordion
      var $this = $(this);
      var triggerBtn = $this.find('[data-binding="expand-accordion-trigger"]');

      var setHeight = function (nV) {
        // set height of inner content for smooth animation
        var innerContent = nV.find('.accordion__content-inner')[0],
            maxHeight = $(innerContent).outerHeight(),
            content = nV.find('.accordion__content')[0];

        if (!content.style.height || content.style.height === '0px') {
          $(content).css('height', maxHeight);
        } else {
          $(content).css('height', '0px');
        }
      };

      var toggleClasses = function (event) {
        var clickedItem = event.currentTarget;
        var currentItem = $(clickedItem).parent();
        var clickedContent = $(currentItem).find('.accordion__content')
        $(currentItem).toggleClass(expandedClass);
        setHeight(currentItem);

        if ($(currentItem).hasClass('is-expanded')) {
          $(clickedItem).attr('aria-selected', 'true');
          $(clickedItem).attr('aria-expanded', 'true');
          $(clickedContent).attr('aria-hidden', 'false');

        } else {
          $(clickedItem).attr('aria-selected', 'false');
          $(clickedItem).attr('aria-expanded', 'false');
          $(clickedContent).attr('aria-hidden', 'true');
        }
      }

      triggerBtn.on('click', function (e) {
        e.preventDefault();
        toggleClasses(e);
      });

      // open tabs if the spacebar or enter button is clicked whilst they are in focus
      $(triggerBtn).on('keydown', function (e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
          e.preventDefault();
          toggleClasses(e);
        }
      });
    });

  });

});

// tabbed content
$(function() {
    var tabs = $("#tabs");

    // For each individual tab DIV, set class and aria-hidden attribute, and hide it
    $(tabs).find("> div").attr({
        "class": "tab__panel",
        "aria-hidden": "true"
    }).hide();

    // Get the list of tab links
    var tabsList = tabs.find("ul:first").attr({
        "class": "tab__list",
    });

    // For each item in the tabs list...
    $(tabsList).find("li > a").each(
        function(a){
            var tab = $(this);

            // Create a unique id using the tab link's href
            var tabId = "tab-" + tab.attr("href").slice(1);

            // Assign tab id and aria-selected attribute to the tab control, but do not remove the href
            tab.attr({
                "id": tabId,
                "aria-selected": "false",
            }).parent().attr("role", "presentation");

            // Assign aria attribute to the relevant tab panel
            $(tabs).find(".tab__panel").eq(a).attr("aria-labelledby", tabId);

            // Set the click event for each tab link
            tab.click(
                function(e){
                    var tabPanel;

                    // Prevent default click event
                    e.preventDefault();

                    // Change state of previously selected tabList item
                    $(tabsList).find("> li.current").removeClass("current").find("> a").attr("aria-selected", "false");

                    // Hide previously selected tabPanel
                    $(tabs).find(".tab__panel:visible").attr("aria-hidden", "true").hide();

                    // Show newly selected tabPanel
                    tabPanel = $(tabs).find(".tab__panel").eq(tab.parent().index());
                    tabPanel.attr("aria-hidden", "false").show();

                    // Set state of newly selected tab list item
                    tab.attr("aria-selected", "true").parent().addClass("current");

                    // Set focus to the first heading in the newly revealed tab content
                    tabPanel.children("h2").attr("tabindex", -1).focus();
                }
            );
        }
    );

    // Set keydown events on tabList item for navigating tabs
    $(tabsList).delegate("a", "keydown",
        function (e) {
            var tab = $(this);
            switch (e.which) {
                case 37: case 38:
                    if (tab.parent().prev().length!=0) {
                        tab.parent().prev().find("> a").click();
                    } else {
                        $(tabsList).find("li:last > a").click();
                    }
                    break;
                case 39: case 40:
                    if (tab.parent().next().length!=0) {
                        tab.parent().next().find("> a").click();
                    } else {
                        $(tabsList).find("li:first > a").click();
                    }
                    break;
            }
        }
    );

    // Show the first tabPanel
    $(tabs).find(".tab__panel:first").attr("aria-hidden", "false").show();

    // Set state for the first tabsList li
    $(tabsList).find("li:first").addClass("current").find(" > a").attr({
        "aria-selected": "true",
        "tabindex": "0"
    });
});

// modal
$(function() {

  // helper function to place modal window as the first child
  // of the #page node
  var m = document.getElementById('modal_window'),
      p = document.getElementById('page');

  function swap () {
    p.parentNode.insertBefore(m, p);
  }

  swap();


  // modal window
  (function() {

    'use strict';

    // list out the vars
    var mOverlay = getId('modal_window'),
        mOpen = getId('modal_open'),
        mClose = getId('modal_close'),
        modal = getId('modal_holder'),
        allNodes = document.querySelectorAll("*"),
        modalOpen = false,
        lastFocus,
        i;


    // Let's cut down on what we need to type to get an ID
    function getId ( id ) {
      return document.getElementById(id);
    }


    // Let's open the modal
    function modalShow () {
      lastFocus = document.activeElement;
      mOverlay.setAttribute('aria-hidden', 'false');
      modalOpen = true;
      modal.setAttribute('tabindex', '0');
      modal.focus();
    }


    // binds to both the button click and the escape key to close the modal window
    // but only if modalOpen is set to true
    function modalClose ( event ) {
      if (modalOpen && ( !event.keyCode || event.keyCode === 27 ) ) {
        mOverlay.setAttribute('aria-hidden', 'true');
        modal.setAttribute('tabindex', '-1');
        modalOpen = false;
        lastFocus.focus();
      }
    }


    // Restrict focus to the modal window when it's open.
    // Tabbing will just loop through the whole modal.
    // Shift + Tab will allow backup to the top of the modal,
    // and then stop.
    function focusRestrict ( event ) {
      if ( modalOpen && !modal.contains( event.target ) ) {
        event.stopPropagation();
        modal.focus();
      }
    }


    // Close modal window by clicking on the overlay
    mOverlay.addEventListener('click', function( e ) {
      if (e.target == modal.parentNode) {
         modalClose( e );
       }
    }, false);


    // open modal by btn click/hit
    mOpen.addEventListener('click', modalShow);

    // close modal by btn click/hit
    mClose.addEventListener('click', modalClose);

    // close modal by keydown, but only if modal is open
    document.addEventListener('keydown', modalClose);

    // restrict tab focus on elements only inside modal window
    for (i = 0; i < allNodes.length; i++) {
      allNodes.item(i).addEventListener('focus', focusRestrict);
    }

  })();

})

// hamburger navigation
$(function() {
  var toggle = document.querySelector('#toggleHamburger');
  var menu = document.querySelector('#hammenu');
  var menuItems = document.querySelectorAll('#menu li a');

  toggle.addEventListener('click', function(){
    if (menu.classList.contains('is-active')) {
      this.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-active');
    } else {
      menu.classList.add('is-active');
      this.setAttribute('aria-expanded', 'true');
      //menuItems[0].focus();
    }
  });
});

// sticky sidebar
$(function() {
  if( $(window).innerWidth() > 768) {
    var sidebar = new StickySidebar('.sidebar', {
      topSpacing: 50,
      bottomSpacing: 20,
      containerSelector: '.sidebar',
      innerWrapperSelector: '.c-sidebar__inner'
    });
  }

});

//
// to top right away
if ( window.location.hash ) scroll(0,0);
// void some browsers issue
setTimeout( function() { scroll(0,0); }, 1);

$(function() {

    // your current click function
    $('.c-sidebar__link').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top + 'px'
        }, 1000, 'swing');
    });

    // *only* if we have anchor on the url
    if(window.location.hash) {

        // smooth scroll to the anchor id
        $('html, body').animate({
            scrollTop: $(window.location.hash).offset().top + 'px'
        }, 1000, 'swing');
    }

});
