package controllers

import (
	"fmt"

	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	var link = "/start"
	if c.Ctx.Request.FormValue("refId") != "" {
		link = fmt.Sprintf("%s?refId=%s", link, c.Ctx.Request.FormValue("refId"))
	}
	c.Data["startLink"] = link
	c.TplName = "index-dark-particle-animation.html"
}

func (c *MainController) Start() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "start.html"
}

func (c *MainController) Dashboard() {
	c.Data["adminActive"] = "active"
	c.Data["Script"] = "/static/app/dashboard.js?v=2"
	c.Layout = "layout.html"
	c.TplName = "dashboard.html"
}

func (c *MainController) MyTeam() {
	c.Data["teamActive"] = "active"
	c.Data["Script"] = "/static/app/partners.js?v=1"
	c.Layout = "layout.html"
	c.TplName = "team.html"
}

func (c *MainController) Upline() {
	c.Data["teamActive"] = "active"
	c.Data["Script"] = "/static/app/uplines.js?v=1"
	c.Layout = "layout.html"
	c.TplName = "upline.html"
}

func (c *MainController) LostProfit() {
	c.Data["teamActive"] = "active"
	c.Data["Script"] = "/static/app/lost.js?v=1"
	c.Layout = "layout.html"
	c.TplName = "lost.html"
}
