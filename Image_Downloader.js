const axios = require('axios');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const empty = require('empty-dir');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://br.pinterest.com/pin/111675265753682801/')

  const img = await page.waitForSelector('img');
  const SRC = await img?.evaluate(el => el.src);

  const H1 = await page.waitForSelector('H1');
  const H1_Content = await H1?.evaluate(el => el.innerText);

  const website = 'https://br.pinterest.com/pin/111675265753682801/'
  const URL_Object = new URL(website)

  const Domain = (URL_Object.hostname.split('.')[1])

  const Writing_Files = async() => {
    const response = await axios.get(SRC, {responseType: 'arraybuffer'})
    fs.writeFileSync(`C:/Users/Edson/Downloads/${Domain}/${H1_Content}.jpg`, response.data)
    console.log('Arquivo criado com sucesso')
  }


  const Checking_Emptiness = async() => {
    empty(`C:/Users/Edson/Downloads/${Domain}`, function (err, result){
      if(err){
        console.log(`Diretório não está vazio`)
      }else{
        if(result){
          console.log('Diretório vazio')
        }
      }
    })
  }

  Checking_Emptiness()

  const Creating_Folder = async() => {
    fs.mkdir(path.join(`C:/Users/Edson/Downloads/${Domain}`),
    (err) => {
      if(err){
        console.log('Diretório já existente')
      }else{
        console.log('Diretório criado com sucesso')
        Writing_Files()
      }
    })
  }


  const Checking_Folder = async() => {
    fs.exists(path.join(`C:/Users/Edson/Downloads/${Domain}`),
    (exists) => {
      if (exists){
        console.log('Esse diretório já existe')
        Checking_Emptiness()
      }else{
        console.log('Diretório será criado aguarde')
        Creating_Folder()
      }
    })
  }

  /*const Checking_Emptiness = async() => {
    const Folder_Content = `C:/Users/Edson/Downloads/${Domain}`

    if(Folder_Content == 0){
      console.log('Esse diretório está vazio')
    }else{
      console.log('Esse diretório não está vazio')
    }
  }*/

  /*const Checking_Files = async() => {
    
    const Path_File = `C:/Users/Edson/Donwloads/${Domain}`

    const response = await axios.get(SRC, {responseType: 'arryabuffer'})

    const Base_64_To_String = Buffer.from(response.data).toString('base64')

    const Read_File = fs.readFileSync(Path_File)

    if(Base_64_To_String == Buffer.from(Read_File).toString('base64')){
      console.log('É o mesmo arquivo não será salvo')
    }else{
      console.log('Arquivos diferentes com o mesmo nome... \n Gostaria de renomear?')
    }
  }*/

  /*Writing()
  //Checking_Emptiness()
  Checking_Files()*/
  //Creating_Folder()
  //Checking_Folder()

  browser.close()
})()