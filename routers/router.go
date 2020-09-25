package routers

import (
	"tronmatrix/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
	beego.Router("/start",&controllers.MainController{},"*:Start")
	beego.Router("/dashboard",&controllers.MainController{},"*:Dashboard")
	beego.Router("/team",&controllers.MainController{},"*:MyTeam")
	beego.Router("/upline",&controllers.MainController{},"*:Upline")
	beego.Router("/lost",&controllers.MainController{},"*:LostProfit")
}
