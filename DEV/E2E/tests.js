const addContext = require('mochawesome/addContext');
const { describe, after, before, it } = require('mocha');
require('chai');
require('chai-as-promised');
let App;
const assert = require('assert');

describe('TEST THE WINDOW', function() {
    const ApplicationController = require('../bootstrap');

    after(async () => {
        try {
            await App.sleep(3000);
            await App.stop();
        } catch (e) {}
    });
    before(async () => {
        App = new ApplicationController();
        await App.start();
        await App.sleep(3000);
    });

    it("A window with the 'User Management' title is visible and focused", async function() {
        await App.sleep(2000);
        App.client
            .waitUntilWindowLoaded()
            .getTitle()
            .should.eventually.equal('User Management');
    });

    it("Check the color of the 'Like' button on the first entry", async function() {
        await App.sleep(1000);
        let elem = await App.client.element('#table > tbody > tr:nth-child(1) > td:nth-child(6) > a.like');
        App.client.elementIdCssProperty(elem.value.ELEMENT, 'color').should.eventually.equal('rgba(0, 123, 255, 1)');
    });

    it("Click the 'Like' button on the second entry", async function() {
        await App.sleep(1000);
        App.client.element('#table > tbody > tr:nth-child(2) > td:nth-child(6) > a.like').click();
    });

    it("Check the color of the 'Like' button on the first entry", async function() {
        await App.sleep(1000);
        let elem = await App.client.element('#table > tbody > tr:nth-child(1) > td:nth-child(6) > a.like');
        App.client.elementIdCssProperty(elem.value.ELEMENT, 'color').should.eventually.equal('rgba(0, 123, 255, 1)');
    });

    it("Check if the 'Like' button on the second entry has the class 'liked'", async function() {
        await App.sleep(1000);
        App.client.element('#table > tbody > tr:nth-child(2) > td:nth-child(6) > a.like').getAttribute('class').should.eventually.match('liked');

        addContext(this, {
            title: 'Classes on the button',
            value: {
                classes: await App.client.element('#table > tbody > tr:nth-child(2) > td:nth-child(6) > a.like').getAttribute('class'),
            },
        });
    });

    // TODO: Fill in the missing steps down below :)

    it("Check how many Electron windows are open", async function() {
        await App.sleep(1000);

        // return the number of open windows
        return App.client.getWindowCount().then(function (count) {
            // check if there is one open window
            assert.equal(count, 1, "There should be only one open window");
        });
    });

    it("Check if the localisation drop-down works if any other locale is selected", async function() {
        await App.sleep(1000);

        // click the languages drop down
        App.client.element("#locale").click();
        await App.sleep(1000);

        // select and click the danish language option
        App.client.element("#locale > option:nth-child(5)").click();
        await App.sleep(1000);

        // take some text that has been modified
        let elem = await App.client.element("div.fixed-table-pagination > div.float-left > span.pagination-info").getText();
        await App.sleep(1000);

        // check if the text has been translated to danish
        assert.equal(elem, "Viser 1 til 10 af 800 rækker", "The text language should be in danish, not english as it is by default");
    });

    it("Select the english language", async function() {
        await App.sleep(1000);

        // select and click the english language option
        App.client.element("#locale > option:nth-child(8)").click();
    });

    it("Check if the pagination works", async function() {
        await App.sleep(1000);

        // select and click the second page
        App.client.element("div.fixed-table-pagination > div.float-right > ul.pagination > li:nth-child(3) > a").click();
        await App.sleep(1000);

        // take the id of the first element of the second page
        let elem = await App.client.element('#table > tbody > tr:nth-child(1) > td:nth-child(3)').getText();
        await App.sleep(1000);

        // check if the id is equal to 10
        assert.equal(elem, 10, "The first element from the second page should have the id equal to 10");
    });

    it("Check if the pagination works", async function() {
        await App.sleep(1000);
        
        // take the text that which shows the number of rows
        let elem = await App.client.element("div.fixed-table-pagination > div.float-left > span.pagination-info").getText();

        // check if the second page is shown
        assert.equal(elem, "Showing 11 to 20 of 800 rows", "The second page should have the rows from 11 to 20");
    });

    it("Click on the first page", async function() {
        await App.sleep(1000);

        // select and click the first page
        App.client.element("div.fixed-table-pagination > div.float-right > ul.pagination > li:nth-child(2) > a").click();
    });

    it("Check if the total amount of entries to be displayed works", async function() {
        await App.sleep(1000);
        
        // select and click on the number of entries dropdown
        App.client.element("div.fixed-table-pagination > div.float-left > span.page-list > span > button").click();
        await App.sleep(1000);

        // select and click on the all entries option
        App.client.element("div.fixed-table-pagination > div.float-left > span.page-list > span > div > a:nth-child(5)").click();
        await App.sleep(1000);

        // take the numbers of the elements on the page
        let elem = await App.client.element("div.fixed-table-footer > table > thead > tr > th:nth-child(4) > div.th-inner").getAttribute("innerHTML");
        await App.sleep(1000);

        // check if the number of rows is equal with 800
        assert.equal(elem, 800, "There should be all 800 rows on the page");
    });

    it("Select 10 rows per page", async function() {
        await App.sleep(1000);

        // select and click on the number of entries dropdown
        App.client.element("div.fixed-table-pagination > div.float-left > span.page-list > span > button").click();

        // select and click on the 10 entries option
        App.client.element("div.fixed-table-pagination > div.float-left > span.page-list > span > div > a:nth-child(1)").click();
    });

    it("Search for any entry which contains value '160'", async function() {
        await App.sleep(1000);
        
        // click the input field and write 160 on the search input field
        App.client.element("div.float-right.search.btn-group > input").click();
        App.client.element("div.float-right.search.btn-group > input").setValue("160");
    });

    it("Delete the entry from the search result & remove the search input text", async function() {
        await App.sleep(1000);
        
        // click the remove button from the entry that was found and remove the search input text
        App.client.element("a.remove").click();
        App.client.element("div.float-right.search.btn-group > input").setValue("");
    });

    it("Search for any entry which contains value '160'", async function() {
        await App.sleep(1000);
        
        // click the search input field and then write 160 
        App.client.element("div.float-right.search.btn-group > input").click();
        App.client.element("div.float-right.search.btn-group > input").setValue("160");
    });

    it("Check if any items are present after the search", async function() {
        await App.sleep(1000);

        // take the total number of items present on the page
        let elem = await App.client.element("div.fixed-table-footer > table > thead > tr > th:nth-child(4) > div.th-inner").getText();

        // check if the obtained number is different than 0
        assert.notEqual(elem, 0, "There should be more than 0 items");
    });

    it("Delete the entry from the search result & remove the search input text", async function() {
        await App.sleep(1000);
        
        // click the remove button from the entry that was found and remove the search input text
        App.client.element("a.remove").click();
        App.client.element("div.float-right.search.btn-group > input").setValue("");
    });

    it("Check if there are 10 rows per page", async function() {
        await App.sleep(1000);

        // take the numbers of the elements on the page
        let elem = await App.client.element("div.fixed-table-footer > table > thead > tr > th:nth-child(4) > div.th-inner").getAttribute("innerHTML");
        await App.sleep(1000);

        // check if the number of rows is equal to 10
        assert.equal(elem, 10, "There should be 10 rows per page");
    });

    it("Delete the first 5 rows", async function() {
        await App.sleep(1000);
        // select the first 5 rows
        App.client.element("#table > tbody > tr:nth-child(1) > td:nth-child(2) > label > input").click();
        App.client.element("#table > tbody > tr:nth-child(2) > td:nth-child(2) > label > input").click();
        App.client.element("#table > tbody > tr:nth-child(3) > td:nth-child(2) > label > input").click();
        App.client.element("#table > tbody > tr:nth-child(4) > td:nth-child(2) > label > input").click();
        App.client.element("#table > tbody > tr:nth-child(5) > td:nth-child(2) > label > input").click();

        // click the delete button
        App.client.element("#remove").click();
    });

    it("Check if there are 5 rows left", async function() {
        await App.sleep(1000);

        // take the numbers of the elements on the page
        let elem = await App.client.element("div.fixed-table-footer > table > thead > tr > th:nth-child(4) > div.th-inner").getAttribute("innerHTML");
        await App.sleep(1000);

        // check if the number of rows left is equal with 5
        assert.equal(elem, 5, "There should be 5 rows left on the page");
    });

    it("Hide the ID field", async function() {
        await App.sleep(1000);

        // click the columns drop down
        App.client.element("div.fixed-table-toolbar > div.columns > div.keep-open > button").click();

        // select and click the id column
        App.client.element("div.fixed-table-toolbar > div.columns > div.keep-open > div > label:nth-child(3) > input").click();
    });

    it("Show the ID field", async function() {
        await App.sleep(1000);

        // select and click the id column
        App.client.element("div.fixed-table-toolbar > div.columns > div.keep-open > div > label:nth-child(3) > input").click();

        // click the columns drop down to close the drop down
        App.client.element("div.fixed-table-toolbar > div.columns > div.keep-open > button").click();
    });

    it("Sort the table by 'Username'", async function() {
        await App.sleep(1000);

        // select and click the username table header to sort the table by username
        App.client.element("div.fixed-table-header > table > thead > tr:nth-child(2) > th:nth-child(1) > div.th-inner").click();
    });

});
