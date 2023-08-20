const dotenv = require('dotenv');
dotenv.config({path: 'config.env'});
const puppeteer = require('puppeteer')
const fs = require('fs');

async function loginCreate (email) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try{
        await page.goto(process.env.URL);
        const username = await page.$("#username")
        const password = await page.$("#password")
        await username.type(process.env.USER)
        await password.type(process.env.PASS) 
        await page.click('.btn')
        await page.waitForSelector("body")
     
       await page.goto(process.env.URL2);
       const packages = '#package'; // Replace with the selector of the element you expect to appear
       await page.waitForSelector(packages);
        await page.select(packages, '500')
        const textArea = await page.$("textarea.form-control")
        await textArea.type(email)


        // Click the button with the specified class and text content
        await page.click('.savebutton')
        await page.waitForNavigation()
     
    
        const targetElementSelector = '.user-undefined td .btn-pink'; // Replace with the selector of the element you expect to appear
        await page.waitForSelector(targetElementSelector);

          let result = []

          //list for url 
          const els = await page.$$('.user-undefined td .btn-pink');
          for (let t of els){
            result.push(await t.evaluate(x => x.getAttribute('data-clipboard-text')));
          }
          await page.screenshot({ path: 'screenshot3.png' });

        const data = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('.user-undefined td'))
            const map = tds.map(td => td.textContent)
            
            let usernameSplit;
            if(map[1].includes("TRIAL EXPIRED"))
            {
                usernameSplit = map[1].split('TRIAL EXPIRED')
            } else if (map[1].includes("TRIAL ALMOST EXPIRED")){
                usernameSplit = map[1].split('TRIAL ALMOST EXPIRED')
            } else {
                usernameSplit = map[1]
            }
            return {
                username: usernameSplit[0],
                password: map[2],
                email: map[4],
                createdDate: new Date()
            }
        });
        data['url'] = result[0]
    
    fs.writeFile('log.txt', JSON.stringify(data), { flag: 'a+' }, err => {
        console.log(err)
    });
    
    const loggedInUrl = page.url();
     return loggedInUrl
    }
    catch(error) {
        console.log("fel:"+ error)
        return null
    }
    finally{
        await browser.close();
    }
}

module.exports = loginCreate