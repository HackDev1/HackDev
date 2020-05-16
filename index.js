const request = require('request');
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const yestoday = dayjs().subtract(1, 'day')

const userName = ""
const passWord = ""
// F12 -> console -> 输入 vm._data.info.area
const area = "四川省 成都市 成华区" // vm._data.info.area
const city = "成都市" // vm._data.info.city
const address = "四川省成都市成华区双桥子街道双林北支路新华公园" // vm._data.info.address
const geo_api_info = "{\"type\":\"complete\",\"position\":{\"P\":30.657445746528,\"O\":104.10448567708397,\"lng\":104.104486,\"lat\":30.657446},\"location_type\":\"html5\",\"message\":\"Get ipLocation failed.Get geolocation success.Convert Success.Get address success.\",\"accuracy\":150,\"isConverted\":true,\"status\":1,\"addressComponent\":{\"citycode\":\"028\",\"adcode\":\"510108\",\"businessAreas\":[{\"name\":\"猛追湾\",\"id\":\"510108\",\"location\":{\"P\":30.666252,\"O\":104.09515899999997,\"lng\":104.095159,\"lat\":30.666252}}],\"neighborhoodType\":\"\",\"neighborhood\":\"\",\"building\":\"\",\"buildingType\":\"\",\"street\":\"一环路东三段\",\"streetNumber\":\"137-139号\",\"province\":\"四川省\",\"city\":\"成都市\",\"district\":\"成华区\",\"township\":\"双桥子街道\"},\"formattedAddress\":\"四川省成都市成华区双桥子街道双林北支路新华公园\",\"roads\":[],\"crosses\":[],\"pois\":[],\"info\":\"SUCCESS\"}" //JSON.stringfy(vm._data.info.geo_api_info)
const province = "四川省"



async function main() {
  
  var options = {
    'method': 'POST',
    'url': 'http://ca.its.csu.edu.cn/Home/Login/215',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    formData: {
      userName,
      passWord,
      'enter': 'true'
    }
  };
  request(options, (error, response) => {
    if (error) throw new Error(error);
    console.log('Login/215: ' );
    let opts = {
      url: "http://ca.its.csu.edu.cn/SysInfo/SsoService/215",
      headers: {
        'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`,
        Cookie: response.headers['set-cookie'],
      }
    };
    request(opts, (e, r, b) => {
      if (error) throw new Error(error);
      console.log('SsoService/215: ');
      let $ = cheerio.load(r.body)
      const url = $('[name="myForm"]').attr('action')
      const tokenId = $('[name="tokenId"]').val()
      const Thirdsys = $('[name="Thirdsys"]').val()
      var opts = {
        'method': 'POST',
        url,
        'headers': {
          'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`,
        },
        formData: {
          tokenId,
          account: userName,
          Thirdsys
        }
      };
      console.log('valid: ')
      request(opts, function (error, res) {
        if (error) throw new Error(error);
        console.log(res.headers['set-cookie']);
        var ops = {
          'method': 'POST',
          'url': 'https://wxxy.csu.edu.cn/ncov/wap/default/save',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`,
            Cookie: res.headers['set-cookie'], //这里是登陆后得到的cookie,(重点)
          },
          formData: {
            "jcjgqr":"0",
            "uid":"164486",
            "created":yestoday.unix(),
            "date": yestoday.format('YYYYMMDD'),
            area,
            city,
            address,
            "jcqzrq":"","sfjcqz":"",
            "szsqsfybl":0,
            "sfsqhzjkk":0,
            "sqhzjkkys":"",
            "sfygtjzzfj":0,
            "gtjzzfjsj":"",
            geo_api_info,
            province,
            "tw":"3",
            "sfzx":"0",
            "created_uid":0,
            "id":1234567,
            "gwszdd":"",
            "sfyqjzgc":"",
            "jrsfqzys":"",
            "jrsfqzfy":"",
            "ismoved":0
          },
        };
        request(ops, function (error, response) {
          if (error) throw new Error(error);
          console.log('submit:'+response.body+ '<br>');
        });
      });
    });
  });

}

main().then(() => {
  console.log('done')
  // process.exit(0)
}).catch(err => {
  console.log(err)
  // process.exit(-1)
})
