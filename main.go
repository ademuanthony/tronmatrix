package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
	"tronmatrix/postgres"
	_ "tronmatrix/routers"

	"github.com/astaxie/beego"
)

const (
	retryDelay       = 60 * time.Second
	maxRetryAttempts = 3
)

func main() {
	log.Println("Env $PORT :", os.Getenv("PORT"))
	if os.Getenv("PORT") != "" {
		port, err := strconv.Atoi(os.Getenv("PORT"))
		if err != nil {
			log.Fatal(err)
			log.Fatal("$PORT must be set")
		}
		log.Println("port : ", port)
		beego.BConfig.Listen.HTTPPort = port
		beego.BConfig.Listen.HTTPSPort = port
	}
	if os.Getenv("BEEGO_ENV") != "" {
		log.Println("Env $BEEGO_ENV :", os.Getenv("BEEGO_ENV"))
		beego.BConfig.RunMode = os.Getenv("BEEGO_ENV")
	}

	// gotenv.Load()
	// db, err := postgres.NewPgDb(false)

	// if err != nil {
	// 	log.Fatalf("error in establishing database connection: %s", err.Error())
	// }
	// defer db.Close()

	// go startPullingProfitEventLog()

	beego.Run()
}

type GetProfitEventResponse struct {
	Success bool `json:"success"`
	Meta    struct {
		At       uint64 `json:"at"`
		PageSize int    `json:"page_size"`
		Links    struct {
			Next string `json:"next"`
		}
	} `json:"meta"`
	Data []postgres.ProfitEvent `json:"data"`
}

func startPullingProfitEventLog() {

	ctx := context.Background()
	pull := func() {
		last, err := postgres.Instance.LastProfitEventTime()
		if err != nil {
			log.Println(err)
		}
		link := fmt.Sprintf("https://api.trongrid.io/v1/contracts/%s/events?event_name=GetLevelProfitEvent&min_block_timestamp=%d&order_by=block_timestamp%%2Casc",
			"TKbVdYmpuV2jPrd9XPgVj3rWoQnuSSz1SQ", last)
		if err := pullGetProfitEvents(ctx, link); err != nil {
			log.Println(err)
		}
	}
	pull()

	ticker := time.NewTicker(2 * time.Minute)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			pull()
			break
		case <-ctx.Done():
			return
		}
	}
}

func pullGetProfitEvents(ctx context.Context, link string) error {
	log.Println("processing", link)
	var result GetProfitEventResponse
	if err := GetResponse(ctx, link, &result); err != nil {
		return err
	}
	if !result.Success {
		return errors.New("GetProfitEvent failed")
	}
	log.Println("got", len(result.Data))
	if len(result.Data) == 0 {
		return nil
	}
	var no int
	for _, rec := range result.Data {
		added, err := postgres.Instance.InsertProfit(ctx, rec)
		if err != nil {
			return err
		}
		if added {
			no++
		}
	}
	log.Println(no, "added")
	if result.Meta.Links.Next != "" && len(result.Data) >= result.Meta.PageSize && no >= 1 {
		return pullGetProfitEvents(ctx, result.Meta.Links.Next)
	}
	log.Println("Can't find new records for now. I will check after 5 minutes")
	return nil
}

// GetResponse attempts to collect json data from the given url string and decodes it into
// the destination
func GetResponse(ctx context.Context, url string, destination interface{}) error {
	// if client has no timeout, set one
	client := http.DefaultClient
	client.Timeout = 10 * time.Second

	resp := new(http.Response)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return err
	}
	req = req.WithContext(ctx)
	defer func() {
		if resp != nil && resp.Body != nil {
			resp.Body.Close()
		}
	}()

	for i := 1; i <= maxRetryAttempts; i++ {
		res, err := client.Do(req)
		if err != nil {
			if res != nil {
				res.Body.Close()
			}
			if i == maxRetryAttempts {
				return err
			}
			time.Sleep(retryDelay)
			continue
		}
		resp = res
		break
	}

	err = json.NewDecoder(resp.Body).Decode(destination)
	if err != nil {
		return err
	}
	return nil
}
