package routers

import (
	"tronmatrix/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
	beego.Router("/start",&controllers.MainController{},"*:Start")
	beego.Router("/dashboard",&controllers.MainController{},"*:Dashboard")
}
