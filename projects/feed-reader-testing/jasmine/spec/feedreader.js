/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against the RSS feeds application.
 */

/* All of tests are placed within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    describe('RSS Feeds', function() {
        /* This test ensures that the allFeeds variable has been defined
         *  and that it is not empty.
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(Array.isArray(allFeeds)).toBeTruthy();
            expect(allFeeds.length).not.toBe(0);
        });

        /* This test loops through each feed in the allFeeds object
         * and ensures it has a URL defined and that the URL is not empty.
         */
        it('all feeds url are defined and not empty', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.url).toBeDefined();
                expect($.type(feed.url) === "string").toBeTruthy();
                expect(feed.url.length).not.toBe(0);
            });
        });

        /* This test loops through each feed in the allFeeds object
         * and ensures it has a name defined and that the name is not empty.
         */
        it('all feeds names are defined and not empty', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined();
                expect($.type(feed.name) === "string").toBeTruthy();
                expect(feed.name.length).not.toBe(0);
            });
        });
    });

    describe('The menu', function() {
        /* This test ensures the menu element is hidden by default. */
        var bodyElement = $('body');
        var linkElement = $('.menu-icon-link');

        it('is hidden by default', function() {
            expect(bodyElement.hasClass('menu-hidden')).toBeTruthy();
        });

         /* This test ensures the menu changes visibility when the menu icon is clicked.
          * It has two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
        it('toggles by click', function() {
            /* The menu should display when it's clicked */
            linkElement.click();
            expect(bodyElement.hasClass('menu-hidden')).toBeFalsy();

            /* The menu should hide when it's clicked again */
            linkElement.click();
            expect(bodyElement.hasClass('menu-hidden')).toBeTruthy();
        });
    });

    describe('Initial Entries', function() {
        /* This test ensures when the loadFeed function is called and completes its work,
         * there is at least a single .entry element within the .feed container.
         * loadFeed() is asynchronous, so this test wil require the use of 
         * Jasmine's beforeEach and asynchronous done() function.
         */
        beforeEach(function(done) {
            /* Clear the .feed div to remove previously loaded feeds */
            $('.feed').empty();
            /* Initially the first feed is load (index 0) */
            loadFeed(0, done);
        });

        it('loads at least one entry within the .feed container', function() {
            /* Get the number of the elements with .entry class */
            var len = $('.entry').length;

            /* len should be greater than 0, which means that there is at least one entry */
            expect(len).toBeGreaterThan(0);
        });
    });

    describe('New Feed Selection', function() {
        /* This test ensures when a new feed is loaded by the loadFeed function,
         * the content actually changes.
         */
        /* Randomly generate an id as the previous feed id. The id is between 0 and 3*/
        var preFeedId = Math.round(3 * Math.random());

        /* Randomly generate an id as the current feed id. The id is between 0 and 3 */
        var curFeedId = Math.round(3 * Math.random());
       /* Current feed id should be different from previous feed id */
        while(curFeedId === preFeedId) {
            curFeedId = Math.round(3 * Math.random());
        }

        var preFeed;
        var feedElement = $('.feed');
        beforeEach(function(done) {
            /* Run the loadFeed() to load the feed with preeFeedId */
            loadFeed(preFeedId, function() {
                /* Get the first feed for comparison purposes */
                preFeed = feedElement.html();

                /* Clear the .feed div to remove previously loaded feeds */
                feedElement.empty();

                /* Run the loadFeed() again to load the feed with curFeedId, 
                * which is a different from preFeedId
                */
                loadFeed(curFeedId, done);
            });
        });

        /* When a new feed is loaded by the loadFeed function, the content actually changes */
        it('changes feeds content', function() {
            /* Get the current feed's html */
            var curFeed = feedElement.html();

            /* Make sure the curFeed variable has been defined and it is not empty */
            expect(curFeed).toBeDefined();
            expect($.type(curFeed) === "string").toBeTruthy();
            expect(curFeed.length).not.toBe(0);

            /* Make sure the curFeed does not equal to the preFeed */
            expect(curFeed).not.toEqual(preFeed);
        });
    });
}());