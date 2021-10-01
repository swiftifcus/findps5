const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
require('dotenv').config();

const link = `https://gigatron.rs/playstation/sony-playstation-5-konzola-+-marvel's-spiderman-miles-morales-+-ratchet-and-clank-rift-apart-+-demon's-souls-remake-428658`;
const optionsSelector = '.location-select-holder select > option';
const selectSelector = '.location-select-holder select';

const transport = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};
const transporter = nodemailer.createTransport(transport);

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(link);
  await page.waitForSelector(selectSelector);

  const cities = await page.$$eval(optionsSelector, options => {
    return options.map(option => option.textContent);
  });

  console.log(typeof cities);
  console.log('Cities ', cities);

  if (cities.includes('Nis') || cities.includes('Niš')) {
    sendMail(transporter);
  }

  browser.close();
}

async function sendMail(transporter) {
  await transporter.sendMail(
    {
      from: 'Marko Ilic',
      to: process.env.EMAIL,
      subject: 'Sony 5 Nis',
      html: `
      <p>Idemo po Sony</p>
    `,
    },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Success', data);
      }
    }
  );
}

main();
