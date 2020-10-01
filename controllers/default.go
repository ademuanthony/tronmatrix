package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.TplName = "index.html"
}

func (c *MainController) Start() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "start.html"
}

func (c *MainController) Dashboard() {
	c.Data["adminActive"] = "active"
	c.Data["Script"] = "/static/app/dashboard.js"
	c.Layout = "layout.html"
	c.TplName = "dashboard.html"
}

func (c *MainController) MyTeam() {
	c.Data["teamActive"] = "active"
	c.Data["Script"] = "/static/app/partners.js"
	c.Layout = "layout.html"
	c.TplName = "team.html"
}

func (c *MainController) Upline() {
	c.Data["teamActive"] = "active"
	c.Data["Script"] = "/static/app/uplines.js"
	c.Layout = "layout.html"
	c.TplName = "upline.html"
}

func (c *MainController) LostProfit() {
	c.Data["teamActive"] = "active"
	c.Data["Script"] = "/static/app/lost.js"
	c.Layout = "layout.html"
	c.TplName = "lost.html"
}
