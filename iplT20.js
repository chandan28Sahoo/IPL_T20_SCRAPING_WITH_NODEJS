const { html } = require("cheerio")

module.exports=((routes,request,cheerio)=>{
    routes
        .get('/',(req,res)=>{
            request('https://www.iplt20.com/schedule',(error, response, body)=>{
                if(!error && response.statusCode==200){
                    const $ =cheerio.load(body);
                    let main_div=$(".js-list");
                    let teams=main_div.find(".fixture__team")
                    let times=main_div.find(".fixture__info")
                    let date=main_div.find("h3")
                    
                    var list_of_date=[]
                    date.each((i,el)=>{
                        let date=$(el).text()
                        list_of_date.push(date)
                        
                    })

                    var list_of_matches=[]
                    let condition = true
                    var teamslist = []
                    teams.each((i,el)=>{
                        let teamA=$(el).find('p[class="fixture__team-name"]').text()
                        teamslist.push(teamA)
                        if (condition){
                            teamslist.push("vs")
                            condition = false
                        }else{
                            list_of_matches.push(teamslist)
                            teamslist = []
                            condition = true
                        }    
                    })
                    var list_of_times=[]
                    var list_of_places=[]
                    times.each((i,el)=>{
                        let time=$(el).find('strong[class="fixture__time"]').text();
                        let place=$(el).find('span').text();
                        list_of_places.push(place)
                        list_of_times.push(time);
                    })
                }
                let all_details=[]
                for(let i=0; i<=list_of_matches.length-1; i++){
                    let dict={
                        "date":list_of_date[i],
                        "Team":list_of_matches[i],
                        "Place":list_of_places[i],
                        "Time":list_of_times[i]
                    }
                    all_details.push(dict)
                }
                res.send(all_details)
            })
        })
})