package controllers

import (
	"net/http"

	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Redirect("/start", http.StatusSeeOther)
}

func (c *MainController) Start() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "start.html"
}

func (c *MainController) Dashboard() {
	c.TplName = "dashboard.html"
}
