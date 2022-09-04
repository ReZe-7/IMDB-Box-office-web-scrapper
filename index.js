const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");
const j2csv = require("json2csv").Parser;

const link = "https://www.imdb.com/chart/boxoffice/?ref_=nv_ch_cht";
(
  async () => {
    let data = [];
    let weeeeek = []
    const response = await request({
      uri: link,
    });
    let $ = cheerio.load(response)
    let titles = $('tr>td[class="titleColumn"]').text().trim().split("\n").filter(entry => entry.trim())
    titles.forEach(element => {
        titles[titles.indexOf(element)] = element.trim()
    });
    let gross = $('span[class="secondaryInfo"]').text().split(/(?=\$)/)

    let weeks = $('td[class="weeksColumn"]')
   
    for (let i = 0; i < weeks.length; i++) {
      weeeeek.push(weeks[i].children[0].data)
      
    }

    for (let i = 0; i < titles.length; i++) {
        data.push({
            title: titles[i],
            gross: gross[i],
            week: weeeeek[i]
        })
        
    }

    console.log(titles);
    console.log(gross);
    console.log(data);
    console.log(weeeeek);
    console.log(weeeeek.length);
    console.log(typeof(weeks));
    const j2cp = new j2csv()
    const csv = j2cp.parse(data)

    fs.writeFileSync("./results.csv",csv)
    console.log("Success!");
  }
)();
